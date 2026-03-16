// =============================================================================
// API de Solicitação por Protocolo
// GET   /api/v1/requests/:protocol - Consultar solicitação
// PATCH /api/v1/requests/:protocol - Atualizar status (admin)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { getPublicByProtocol, getByProtocol, updateStatus } from "@/lib/requests";
import prisma from "@/lib/db";

// GET - Consultar solicitação por protocolo
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ protocol: string }> }
) {
  try {
    const { protocol } = await params;

    if (!protocol || protocol.length < 6) {
      return NextResponse.json(
        { success: false, error: "Protocolo inválido" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (user && isStaff(user)) {
      const request = await getByProtocol(protocol);
      if (!request) {
        return NextResponse.json(
          { success: false, error: "Protocolo não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: request });
    }

    const publicData = await getPublicByProtocol(protocol);
    if (!publicData) {
      return NextResponse.json(
        { success: false, error: "Protocolo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: publicData });
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ protocol: string }> }
) {
  try {
    const { protocol } = await params;
    const user = await getCurrentUser();

    if (!user || !isStaff(user)) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, message, assigneeId, departmentId, isPublic } = body;

    if (!status || !message) {
      return NextResponse.json(
        { success: false, error: "Status e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const result = await updateStatus(
      protocol,
      status as string,
      message,
      user.id,
      user.name,
      isPublic !== false
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    if (assigneeId || departmentId) {
      await prisma.serviceRequest.update({
        where: { protocol },
        data: {
          ...(assigneeId && { assigneeId }),
          ...(departmentId && { departmentId }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}