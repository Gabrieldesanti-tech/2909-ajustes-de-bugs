// =============================================================================
// POST /api/v1/phiz/sync-user
// Receives user info from mini-program (getPhizUserInfo) for sync/link.
// Creates or links User by phizUserId.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface PhizUserPayload {
  userId: string;
  nickname?: string;
  avatarUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PhizUserPayload;
    const { userId: phizUserId, nickname, avatarUrl } = body;

    if (!phizUserId || typeof phizUserId !== "string") {
      return NextResponse.json(
        { success: false, error: "userId obrigatório" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { phizUserId },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          phizUserId: existing.phizUserId,
        },
        message: "Usuário já vinculado",
      });
    }

    // User not linked - return minimal info so mini-program can prompt
    // user to register on website and link
    return NextResponse.json({
      success: true,
      data: null,
      linked: false,
      message:
        "Conta Phiz não vinculada ao portal. Cadastre-se em belfordroxo.rj.gov.br e vincule nas configurações.",
    });
  } catch (error) {
    console.error("[Phiz] Sync-user error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
