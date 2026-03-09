import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

// ============================================================================
// GET - Listar notificações (com geração automática)
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("countOnly") === "true";

    // Buscar notificações reais da tabela (inclui as marcadas como lidas)
    const storedNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // IDs de notificações automáticas já lidas (armazenadas com userId = "__auto_read__")
    const readAutoIds = new Set(
      storedNotifications
        .filter(n => n.userId === "__auto_read__" && n.isRead)
        .map(n => n.data || "")
    );

    // Notificações reais do usuário (excluindo os markers de leitura)
    const realNotifications = storedNotifications
      .filter(n => n.userId !== "__auto_read__")
      .map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        link: n.data ? tryParseLink(n.data) : null,
      }));

    // Gerar notificações automáticas (já marcando as lidas)
    const autoNotifications = await generateAutoNotifications(readAutoIds);

    const allNotifications = [...autoNotifications, ...realNotifications];
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (countOnly) {
      const unread = allNotifications.filter(n => !n.isRead).length;
      return NextResponse.json({ success: true, unread, total: allNotifications.length });
    }

    return NextResponse.json({ success: true, data: allNotifications });
  } catch (error) {
    console.error("Erro ao listar notificações:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// ============================================================================
// PATCH - Marcar notificação como lida
// ============================================================================
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const { id, markAll } = body;

    // Marcar todas como lidas
    if (markAll) {
      // Marcar notificações reais
      await prisma.notification.updateMany({
        where: { isRead: false, userId: { not: "__auto_read__" } },
        data: { isRead: true },
      });

      // Buscar todas as automáticas não lidas e criar marcadores
      const readAutoIds = new Set(
        (await prisma.notification.findMany({
          where: { userId: "__auto_read__", isRead: true },
          select: { data: true },
        })).map(n => n.data || "")
      );

      const autoNotifications = await generateAutoNotifications(readAutoIds);
      const unread = autoNotifications.filter(n => !n.isRead);

      for (const n of unread) {
        await prisma.notification.create({
          data: {
            userId: "__auto_read__",
            type: "SYSTEM",
            title: "read_marker",
            message: "",
            data: n.id,
            isRead: true,
          },
        });
      }

      return NextResponse.json({ success: true, message: "Todas as notificações marcadas como lidas" });
    }

    // Marcar uma única notificação como lida
    if (!id) {
      return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    }

    if (id.startsWith("auto-")) {
      // Notificação automática: verificar se já existe marcador
      const existing = await prisma.notification.findFirst({
        where: { userId: "__auto_read__", data: id, isRead: true },
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            userId: "__auto_read__",
            type: "SYSTEM",
            title: "read_marker",
            message: "",
            data: id,
            isRead: true,
          },
        });
      }
    } else {
      // Notificação real: atualizar diretamente
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, message: "Notificação marcada como lida" });
  } catch (error) {
    console.error("Erro ao marcar notificação:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// ============================================================================
// Geração automática de notificações
// ============================================================================
async function generateAutoNotifications(readAutoIds: Set<string>) {
  const notifications: {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    link: string | null;
  }[] = [];

  // 1. Solicitações pendentes
  const pendingRequests = await prisma.serviceRequest.findMany({
    where: { status: "PENDING" },
    include: { service: true, department: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  for (const req of pendingRequests) {
    const autoId = `auto-pending-${req.id}`;
    notifications.push({
      id: autoId,
      type: "STATUS_UPDATE",
      title: "Nova solicitação aguardando análise",
      message: `Protocolo ${req.protocol} - ${req.service.name}${req.department ? ` (${req.department.name.split(" - ")[1] || req.department.name})` : ""}`,
      isRead: readAutoIds.has(autoId),
      createdAt: req.createdAt.toISOString(),
      link: `/admin/solicitacoes/${req.protocol}`,
    });
  }

  // 2. SLA expirados
  const slaBreached = await prisma.serviceRequest.findMany({
    where: {
      slaBreached: true,
      status: { notIn: ["RESOLVED", "CLOSED", "CANCELLED"] },
    },
    include: { service: true },
    orderBy: { slaDeadline: "asc" },
    take: 10,
  });

  for (const req of slaBreached) {
    const autoId = `auto-sla-${req.id}`;
    notifications.push({
      id: autoId,
      type: "SLA_BREACH",
      title: "SLA expirado",
      message: `Protocolo ${req.protocol} - ${req.service.name} ultrapassou o prazo de atendimento.`,
      isRead: readAutoIds.has(autoId),
      createdAt: (req.slaDeadline || req.updatedAt).toISOString(),
      link: `/admin/solicitacoes/${req.protocol}`,
    });
  }

  // 3. SLA próximo do vencimento (< 24h)
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const slaWarning = await prisma.serviceRequest.findMany({
    where: {
      slaBreached: false,
      slaDeadline: { gte: now, lte: next24h },
      status: { notIn: ["RESOLVED", "CLOSED", "CANCELLED"] },
    },
    include: { service: true },
    orderBy: { slaDeadline: "asc" },
    take: 10,
  });

  for (const req of slaWarning) {
    const autoId = `auto-sla-warn-${req.id}`;
    const hoursLeft = Math.round((new Date(req.slaDeadline!).getTime() - now.getTime()) / (1000 * 60 * 60));
    notifications.push({
      id: autoId,
      type: "SLA_WARNING",
      title: "SLA próximo do vencimento",
      message: `Protocolo ${req.protocol} - ${req.service.name} vence em ${hoursLeft}h.`,
      isRead: readAutoIds.has(autoId),
      createdAt: now.toISOString(),
      link: `/admin/solicitacoes/${req.protocol}`,
    });
  }

  return notifications;
}

function tryParseLink(data: string): string | null {
  try {
    const parsed = JSON.parse(data);
    return parsed?.link || null;
  } catch {
    return null;
  }
}
