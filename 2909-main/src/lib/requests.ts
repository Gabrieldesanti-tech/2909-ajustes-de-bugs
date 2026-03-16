// =============================================================================
// Gerenciamento de Solicitações - Camada de Negócio
// =============================================================================

import prisma from "./db";
import { generateProtocol } from "./utils";
import type { RequestFilters, DashboardStats, PaginatedResponse } from "@/types";

const SLA_HOURS_BY_PRIORITY: Record<string, number> = {
  LOW: 240,
  NORMAL: 120,
  HIGH: 48,
  URGENT: 24,
};

// =============================================================================
// CRIAR SOLICITAÇÃO
// =============================================================================

export async function create(data: {
  userId?: string;
  serviceId: string;
  description: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isAnonymous: boolean;
  origin?: string;
  extraData?: Record<string, unknown>;
}): Promise<{ success: boolean; protocol?: string; error?: string }> {
  try {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { category: true },
    });

    if (!service) {
      return { success: false, error: "Serviço não encontrado" };
    }

    const protocol = generateProtocol();
    const slaHours = service.slaHours || SLA_HOURS_BY_PRIORITY[service.slaPriority] || 120;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    // Auto-atribuir secretaria responsável baseada na categoria
    const departmentId = service.category.departmentId || null;

    const req = await prisma.serviceRequest.create({
      data: {
        protocol,
        userId: data.isAnonymous ? null : (data.userId || null),
        serviceId: data.serviceId,
        description: data.description,
        status: "PENDING",
        origin: data.origin || "PORTAL",
        isAnonymous: data.isAnonymous,
        slaDeadline,
        departmentId,
        extraData: data.extraData ? JSON.stringify(data.extraData) : null,
        ...(data.address && {
          address: {
            create: {
              street: data.address.street,
              number: data.address.number,
              complement: data.address.complement || null,
              neighborhood: data.address.neighborhood,
              city: data.address.city || "Belford Roxo",
              state: data.address.state || "RJ",
              zipCode: data.address.zipCode,
            },
          },
        }),
        history: {
          create: {
            toStatus: "PENDING",
            message: "Solicitação registrada no sistema.",
            isPublic: true,
            userId: data.userId || null,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: "CREATE",
        entity: "service_s",
        entityId: req.id,
        newValues: JSON.stringify({ protocol, serviceId: data.serviceId, origin: data.origin || "PORTAL" }),
      },
    });

    return { success: true, protocol };
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return { success: false, error: "Erro interno ao criar solicitação" };
  }
}

// =============================================================================
// BUSCAR SOLICITAÇÃO POR PROTOCOLO
// =============================================================================

export async function getByProtocol(protocol: string) {
  return prisma.serviceRequest.findUnique({
    where: { protocol: protocol.toUpperCase() },
    include: {
      service: { include: { category: true } },
      address: true,
      attachments: true,
      history: { orderBy: { createdAt: "asc" } },
      comments: {
        where: { isInternal: false },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      user: { select: { name: true, email: true } },
      assignee: { select: { name: true } },
      department: { select: { name: true } },
    },
  });
}

// =============================================================================
// BUSCAR SOLICITAÇÃO POR PROTOCOLO (VERSÃO PÚBLICA - LGPD)
// =============================================================================

export async function getPublicByProtocol(protocol: string) {
  const req = await getByProtocol(protocol);
  if (!req) return null;

  return {
    protocol: req.protocol,
    serviceName: req.service.name,
    categoryName: req.service.category.name,
    status: req.status,
    description: req.description,
    address: req.address ? {
      neighborhood: req.address.neighborhood,
      city: req.address.city,
    } : null,
    createdAt: req.createdAt,
    updatedAt: req.updatedAt,
    resolvedAt: req.resolvedAt,
    slaDeadline: req.slaDeadline,
    slaBreached: req.slaBreached,
    history: req.history
      .filter(h => h.isPublic)
      .map(h => ({
        status: h.toStatus,
        message: h.message,
        createdAt: h.createdAt,
      })),
  };
}

// =============================================================================
// LISTAR SOLICITAÇÕES COM FILTROS (ADMIN)
// =============================================================================

export async function lists(filters: RequestFilters): Promise<PaginatedResponse<unknown>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.serviceId) where.serviceId = filters.serviceId;
  if (filters.origin) where.origin = filters.origin;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters.departmentId) where.departmentId = filters.departmentId;
  if (filters.slaBreached !== undefined) where.slaBreached = filters.slaBreached;

  if (filters.categoryId) {
    where.service = { categoryId: filters.categoryId };
  }

  if (filters.neighborhood) {
    where.address = { neighborhood: { contains: filters.neighborhood } };
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(filters.dateFrom);
    if (filters.dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(filters.dateTo + "T23:59:59");
  }

  if (filters.search) {
    where.OR = [
      { protocol: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const orderBy: Record<string, string> = {};
  orderBy[filters.sortBy || "createdAt"] = filters.sortOrder || "desc";

  const [data, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: where as never,
      include: {
        service: { include: { category: true } },
        address: true,
        user: { select: { name: true, email: true, cpf: true } },
        assignee: { select: { name: true } },
        department: { select: { name: true } },
        _count: { select: { attachments: true, comments: true } },
      },
      orderBy: orderBy as never,
      skip,
      take: limit,
    }),
    prisma.serviceRequest.count({ where: where as never }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// =============================================================================
// ATUALIZAR STATUS
// =============================================================================

export async function updateStatus(
  protocol: string,
  status: string,
  message: string,
  userId?: string,
  userName?: string,
  isPublic = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const req = await prisma.serviceRequest.findUnique({ where: { protocol } });

    if (!req) {
      return { success: false, error: "Solicitação não encontrada" };
    }

    const oldStatus = req.status;

    if (!isValidStatusTransition(oldStatus, status)) {
      return { success: false, error: `Transição de ${oldStatus} para ${status} não é permitida` };
    }

    const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === "RESOLVED") updateData.resolvedAt = new Date();
    if (status === "CLOSED") updateData.closedAt = new Date();

    await prisma.$transaction([
      prisma.serviceRequest.update({
        where: { protocol },
        data: updateData as never,
      }),
      prisma.requestHistory.create({
        data: {
          requestId: req.id,
          fromStatus: oldStatus,
          toStatus: status,
          message,
          isPublic,
          userId,
          userName,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: "STATUS_CHANGE",
          entity: "service_s",
          entityId: req.id,
          oldValues: JSON.stringify({ status: oldStatus }),
          newValues: JSON.stringify({ status }),
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: "Erro interno ao atualizar status" };
  }
}

// =============================================================================
// VALIDAÇÃO DE TRANSIÇÕES DE STATUS
// =============================================================================

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["IN_PROGRESS", "FORWARDED", "RESOLVED", "CANCELLED"],
  IN_PROGRESS: ["WAITING_INFO", "FORWARDED", "RESOLVED", "CANCELLED"],
  WAITING_INFO: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
  FORWARDED: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  CANCELLED: ["REOPENED"],
  REOPENED: ["IN_PROGRESS", "FORWARDED", "RESOLVED"],
};

function isValidStatusTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// =============================================================================
// ESTATÍSTICAS PARA DASHBOARD
// =============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRequests, pendingRequests, inProgressRequests, resolvedRequests,
    closedRequests, cancelledRequests, slaBreached,
    todayRequests, weekRequests, monthRequests, resolvedWithTime,
  ] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.count({ where: { status: "IN_PROGRESS" } }),
    prisma.serviceRequest.count({ where: { status: "RESOLVED" } }),
    prisma.serviceRequest.count({ where: { status: "CLOSED" } }),
    prisma.serviceRequest.count({ where: { status: "CANCELLED" } }),
    prisma.serviceRequest.count({ where: { slaBreached: true } }),
    prisma.serviceRequest.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.serviceRequest.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.serviceRequest.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.serviceRequest.findMany({
      where: { resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
      take: 1000,
      orderBy: { resolvedAt: "desc" },
    }),
  ]);

  let avgResolutionHours = 0;
  if (resolvedWithTime.length > 0) {
    const totalHours = resolvedWithTime.reduce((sum, r) => {
      if (r.resolvedAt) {
        return sum + (r.resolvedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);
    avgResolutionHours = Math.round(totalHours / resolvedWithTime.length);
  }

  return {
    totalRequests, pendingRequests, inProgressRequests, resolvedRequests,
    closedRequests, cancelledRequests, slaBreached, avgResolutionHours,
    todayRequests, weekRequests, monthRequests,
  };
}

// =============================================================================
// DADOS PARA GRÁFICOS
// =============================================================================

export async function getsByStatusChart() {
  const statusColors: Record<string, string> = {
    PENDING: "#eab308", IN_PROGRESS: "#3b82f6", WAITING_INFO: "#f97316",
    FORWARDED: "#8b5cf6", RESOLVED: "#22c55e", CLOSED: "#6b7280",
    CANCELLED: "#ef4444", REOPENED: "#06b6d4",
  };
  const statusLabels: Record<string, string> = {
    PENDING: "Aguardando", IN_PROGRESS: "Em andamento", WAITING_INFO: "Aguardando info",
    FORWARDED: "Encaminhado", RESOLVED: "Resolvido", CLOSED: "Encerrado",
    CANCELLED: "Cancelado", REOPENED: "Reaberto",
  };

  const results = await prisma.serviceRequest.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return results.map(r => ({
    status: r.status,
    statusLabel: statusLabels[r.status] || r.status,
    count: r._count.id,
    color: statusColors[r.status] || "#999",
  }));
}

export async function getsByPeriod(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const s = await prisma.serviceRequest.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped: Record<string, number> = {};
  s.forEach(r => {
    const date = r.createdAt.toISOString().split("T")[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export async function getsByCategory() {
  const results = await prisma.serviceRequest.groupBy({
    by: ["serviceId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  const services = await prisma.service.findMany({
    where: { id: { in: results.map(r => r.serviceId) } },
    include: { category: true },
  });

  return results.map(r => {
    const service = services.find(s => s.id === r.serviceId);
    return {
      category: service?.category.name || "Desconhecido",
      service: service?.name || "Desconhecido",
      count: r._count.id,
    };
  });
}

export async function getsByNeighborhood() {
  const addresses = await prisma.address.findMany({
    where: { requestId: { not: null } },
    select: { neighborhood: true },
  });

  const grouped: Record<string, number> = {};
  addresses.forEach(a => {
    const key = a.neighborhood || "Não informado";
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([neighborhood, count]) => ({ neighborhood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

export async function checkAndUpdateSlaBreaches(): Promise<number> {
  const now = new Date();
  const result = await prisma.serviceRequest.updateMany({
    where: {
      slaBreached: false,
      slaDeadline: { lt: now },
      status: { notIn: ["RESOLVED", "CLOSED", "CANCELLED"] },
    },
    data: { slaBreached: true },
  });
  return result.count;
}
