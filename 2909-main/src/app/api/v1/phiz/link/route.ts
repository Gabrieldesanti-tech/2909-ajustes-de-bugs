// =============================================================================
// POST /api/v1/phiz/link
// Links logged-in user's account with Phiz userId (from QR scan)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scan_token: scanToken } = body as { scan_token?: string };

    if (!scanToken || typeof scanToken !== "string") {
      return NextResponse.json(
        { success: false, error: "scan_token obrigatório" },
        { status: 400 }
      );
    }

    const session = await prisma.phizLoginSession.findUnique({
      where: { scanToken },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    if (session.status !== "COMPLETED" || !session.phizUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Escaneie o QR code com o app Phiz primeiro",
        },
        { status: 400 }
      );
    }

    const existingPhiz = await prisma.user.findFirst({
      where: {
        phizUserId: session.phizUserId,
        id: { not: user.id },
      },
    });

    if (existingPhiz) {
      return NextResponse.json(
        { success: false, error: "Esta conta Phiz já está vinculada a outro usuário" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { phizUserId: session.phizUserId },
    });

    return NextResponse.json({
      success: true,
      message: "Conta Phiz vinculada com sucesso",
    });
  } catch (error) {
    console.error("[Phiz] Link error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
