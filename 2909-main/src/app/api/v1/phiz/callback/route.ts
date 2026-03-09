// =============================================================================
// GET/POST /api/v1/phiz/callback
// Handles Phiz platform callback when user scans QR code.
// Supports both GET (?userId=xxx) and POST (body: { userId }) per spec.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  return handleCallback(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleCallback(request, "POST");
}

async function handleCallback(request: NextRequest, method: string) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    let userId: string | null = searchParams.get("userId");

    if (method === "POST" && !userId) {
      try {
        const body = await request.json();
        userId = typeof body?.userId === "string" ? body.userId : null;
      } catch {
        // ignore
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token obrigatório" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId obrigatório" },
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

    if (session.status !== "PENDING") {
      return NextResponse.json(
        { success: true, message: "Sessão já processada" },
        { status: 200 }
      );
    }

    if (session.expiresAt < new Date()) {
      await prisma.phizLoginSession.update({
        where: { scanToken: token },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { success: false, error: "QR code expirado" },
        { status: 410 }
      );
    }

    await prisma.phizLoginSession.update({
      where: { scanToken: token },
      data: {
        phizUserId: userId,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("[Phiz] Callback error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
