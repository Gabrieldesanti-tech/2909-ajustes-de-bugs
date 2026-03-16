// =============================================================================
// API de Comentários em Solicitação
// POST /api/v1/requests/:protocol/comments
// GET  /api/v1/requests/:protocol/comments
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

// POST - Adicionar comentário
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ protocol: string }> }
) {
  try {
    const { protocol } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, isInternal } = body;

    if (!content || content.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Comentário deve ter pelo menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Buscar solicitação
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { protocol },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    // Comentários internos só podem ser criados por staff
    if (isInternal && !isStaff(user)) {
      return NextResponse.json(
        { success: false, error: "Sem permissão para comentários internos" },
        { status: 403 }
      );
    }

    const comment = await prisma.requestComment.create({
      data: {
        requestId: serviceRequest.id,
        userId: user.id,
        content: content.trim(),
        isInternal: isInternal || false,
      },
      include: { user: { select: { name: true } } },
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "COMMENT",
        entity: "request_comments",
        entityId: comment.id,
        newValues: JSON.stringify({ protocol, isInternal }),
      },
    });

    return NextResponse.json(
      { success: true, data: comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

// GET - Listar comentários
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ protocol: string }> }
) {
  try {
    const { protocol } = await params;
    const user = await getCurrentUser();

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { protocol },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    // Staff pode ver comentários internos
    const showInternal = user && isStaff(user);

    const comments = await prisma.requestComment.findMany({
      where: {
        requestId: serviceRequest.id,
        ...(showInternal ? {} : { isInternal: false }),
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
