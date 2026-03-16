// =============================================================================
// GET /api/v1/admin/reports/export
// Exportação de relatórios em CSV
// =============================================================================
// Decisão técnica: CSV nativo (sem dependência externa) para exportação leve.
// Para Excel, o frontend converte usando a lib xlsx no client-side.
// Para PDF, o frontend gera usando jspdf no client-side.
// Isso evita sobrecarga no servidor e permite personalização visual.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasMinRole } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !hasMinRole(user.role, "MANAGER")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado. Requer perfil Gestor ou superior." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status");

    // Construir filtros
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo + "T23:59:59");
    }

    const requests = await prisma.serviceRequest.findMany({
      where: where as never,
      include: {
        service: { include: { category: true } },
        address: true,
        user: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10000, // Limite de segurança
    });

    // Log de auditoria para exportação
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "EXPORT",
        entity: "service_requests",
        newValues: JSON.stringify({ format, filters: { dateFrom, dateTo, status }, recordCount: requests.length }),
      },
    });

    if (format === "csv") {
      // Gerar CSV
      const headers = [
        "Protocolo",
        "Data Abertura",
        "Status",
        "Categoria",
        "Serviço",
        "Descrição",
        "Bairro",
        "Origem",
        "Atribuído a",
        "Secretaria",
        "SLA Expirado",
        "Data Resolução",
      ].join(";");

      const rows = requests.map(r => [
        r.protocol,
        r.createdAt.toLocaleDateString("pt-BR"),
        r.status,
        r.service.category.name,
        r.service.name,
        `"${r.description.replace(/"/g, '""').substring(0, 200)}"`,
        r.address?.neighborhood || "",
        r.origin,
        r.assignee?.name || "",
        r.department?.name || "Não definida",
        r.slaBreached ? "Sim" : "Não",
        r.resolvedAt?.toLocaleDateString("pt-BR") || "",
      ].join(";"));

      const csv = [headers, ...rows].join("\n");
      
      // BOM para UTF-8 correto no Excel
      const bom = "\uFEFF";

      return new NextResponse(bom + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="relatorio-solicitacoes-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON para processamento client-side (Excel/PDF)
    return NextResponse.json({
      success: true,
      data: requests.map(r => ({
        protocol: r.protocol,
        createdAt: r.createdAt,
        status: r.status,
        category: r.service.category.name,
        service: r.service.name,
        description: r.description.substring(0, 200),
        neighborhood: r.address?.neighborhood || "",
        origin: r.origin,
        assignee: r.assignee?.name || "",
        secretaria: r.department?.name || "Não definida",
        slaBreached: r.slaBreached,
        resolvedAt: r.resolvedAt,
        citizenName: r.user?.name || "Anônimo",
      })),
      total: requests.length,
    });
  } catch (error) {
    console.error("Erro ao exportar relatório:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
