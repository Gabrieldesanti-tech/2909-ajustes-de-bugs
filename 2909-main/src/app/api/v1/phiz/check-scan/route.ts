// =============================================================================
// GET /api/v1/phiz/check-scan?token=xxx
// Polls scan status - returns phizUserId when user has scanned
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token obrigatório" },
        { status: 400 }
      );
    }

    const session = await prisma.phizLoginSession.findUnique({
      where: { scanToken: token },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    if (session.expiresAt < new Date() && session.status === "PENDING") {
      await prisma.phizLoginSession.update({
        where: { scanToken: token },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({
        success: true,
        status: "EXPIRED",
        message: "QR code expirado",
      });
    }

    return NextResponse.json({
      success: true,
      status: session.status,
      phiz_user_id: session.phizUserId ?? undefined,
    });
  } catch (error) {
    console.error("[Phiz] Check-scan error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
