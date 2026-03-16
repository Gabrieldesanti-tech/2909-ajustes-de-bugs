import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// API pública de estatísticas (sem autenticação)
export async function GET() {
  try {
    const [
      totalRequests, resolvedCount, pendingCount, inProgressCount,
      slaBreachedCount, totalUsers, totalServices,
    ] = await Promise.all([
      prisma.serviceRequest.count().catch(() => 0),
      prisma.serviceRequest.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }).catch(() => 0),
      prisma.serviceRequest.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.serviceRequest.count({ where: { status: "IN_PROGRESS" } }).catch(() => 0),
      prisma.serviceRequest.count({ where: { slaBreached: true } }).catch(() => 0),
      prisma.user.count({ where: { role: "CITIZEN" } }).catch(() => 0),
      prisma.service.count({ where: { isActive: true } }).catch(() => 0),
    ]);

    // Resolução média
    let avgHours = 0;
    try {
      const resolved = await prisma.serviceRequest.findMany({
        where: { resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
        take: 500,
      });
      if (resolved.length > 0) {
        const total = resolved.reduce((s, r) => s + ((r.resolvedAt!.getTime() - r.createdAt.getTime()) / 3600000), 0);
        avgHours = Math.round(total / resolved.length);
      }
    } catch { /* banco vazio */ }

    const slaRate = totalRequests > 0 ? Math.round(((totalRequests - slaBreachedCount) / totalRequests) * 100) : 100;

    // Por status
    let byStatusChart: { name: string; value: number; color: string }[] = [];
    try {
      const byStatus = await prisma.serviceRequest.groupBy({ by: ["status"], _count: { id: true } });
      const statusLabels: Record<string, string> = {
        PENDING: "Aguardando", IN_PROGRESS: "Em andamento", WAITING_INFO: "Aguard. info",
        FORWARDED: "Encaminhado", RESOLVED: "Resolvido", CLOSED: "Encerrado",
        CANCELLED: "Cancelado", REOPENED: "Reaberto",
      };
      const statusColors: Record<string, string> = {
        PENDING: "#eab308", IN_PROGRESS: "#3b82f6", WAITING_INFO: "#f97316",
        FORWARDED: "#8b5cf6", RESOLVED: "#22c55e", CLOSED: "#6b7280",
        CANCELLED: "#ef4444", REOPENED: "#06b6d4",
      };
      byStatusChart = byStatus.map(s => ({ name: statusLabels[s.status] || s.status, value: s._count.id, color: statusColors[s.status] || "#999" }));
    } catch { /* banco vazio */ }

    // Por secretaria
    let byDepartmentChart: { name: string; fullName: string; count: number }[] = [];
    try {
      const byDeptRaw = await prisma.serviceRequest.groupBy({
        by: ["departmentId"], _count: { id: true }, orderBy: { _count: { id: "desc" } },
      });
      const deptIds = byDeptRaw.map(d => d.departmentId).filter(Boolean) as string[];
      const depts = deptIds.length > 0
        ? await prisma.department.findMany({ where: { id: { in: deptIds } }, select: { id: true, name: true } })
        : [];
      const deptMap = Object.fromEntries(depts.map(d => [d.id, d.name]));
      byDepartmentChart = byDeptRaw.map(d => ({
        name: d.departmentId ? (deptMap[d.departmentId]?.split(" - ")[1] || deptMap[d.departmentId] || "?") : "N/A",
        fullName: d.departmentId ? (deptMap[d.departmentId] || "?") : "N/A",
        count: d._count.id,
      }));
    } catch { /* banco vazio */ }

    // Por período
    let byPeriodChart: { date: string; count: number }[] = [];
    try {
      const allReqs = await prisma.serviceRequest.findMany({
        select: { createdAt: true }, orderBy: { createdAt: "asc" },
      });
      const byPeriod: Record<string, number> = {};
      allReqs.forEach(r => { const d = r.createdAt.toISOString().split("T")[0]; byPeriod[d] = (byPeriod[d] || 0) + 1; });
      byPeriodChart = Object.entries(byPeriod).map(([date, count]) => ({ date, count }));
    } catch { /* banco vazio */ }

    // Por bairro
    let byNeighborhoodChart: { name: string; count: number }[] = [];
    try {
      const addrs = await prisma.address.findMany({ where: { requestId: { not: null } }, select: { neighborhood: true } });
      const neighMap: Record<string, number> = {};
      addrs.forEach(a => { const k = a.neighborhood || "N/I"; neighMap[k] = (neighMap[k] || 0) + 1; });
      byNeighborhoodChart = Object.entries(neighMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 15);
    } catch { /* banco vazio */ }

    // Por serviço
    let byServiceChart: { name: string; count: number }[] = [];
    try {
      const bySvcRaw = await prisma.serviceRequest.groupBy({
        by: ["serviceId"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 10,
      });
      const svcIds = bySvcRaw.map(s => s.serviceId);
      const svcs = svcIds.length > 0
        ? await prisma.service.findMany({ where: { id: { in: svcIds } }, select: { id: true, name: true } })
        : [];
      const svcMap = Object.fromEntries(svcs.map(s => [s.id, s.name]));
      byServiceChart = bySvcRaw.map(s => ({ name: svcMap[s.serviceId] || "?", count: s._count.id }));
    } catch { /* banco vazio */ }

    return NextResponse.json({
      success: true,
      data: {
        kpis: { totalRequests, resolvedCount, pendingCount, inProgressCount, slaBreachedCount, slaRate, avgHours, totalUsers, totalServices },
        charts: {
          byStatus: byStatusChart,
          byDepartment: byDepartmentChart,
          byPeriod: byPeriodChart,
          byNeighborhood: byNeighborhoodChart,
          byService: byServiceChart,
        },
      },
    });
  } catch (error) {
    console.error("Erro stats públicas:", error);
    // Retornar dados vazios em vez de erro 500
    return NextResponse.json({
      success: true,
      data: {
        kpis: { totalRequests: 0, resolvedCount: 0, pendingCount: 0, inProgressCount: 0, slaBreachedCount: 0, slaRate: 100, avgHours: 0, totalUsers: 0, totalServices: 0 },
        charts: { byStatus: [], byDepartment: [], byPeriod: [], byNeighborhood: [], byService: [] },
      },
    });
  }
}
