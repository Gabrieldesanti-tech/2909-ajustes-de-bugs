// =============================================================================
// POST /api/v1/phiz/login
// Logs in user via Phiz userId (after QR scan completed).
// Requires scan_token and creates session if User exists with linked phizUserId.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateToken } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import type { UserRole } from "@/types";

const COOKIE_NAME = "auth_token";

export async function POST(request: NextRequest) {
  try {
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
          error:
            session.status === "EXPIRED"
              ? "QR code expirado. Gere um novo."
              : "Aguardando escaneamento do QR code",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        phizUserId: session.phizUserId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Conta não vinculada",
          code: "PHIZ_NOT_LINKED",
          message:
            "Sua conta Phiz ainda não está vinculada. Cadastre-se no portal e vincule nas configurações.",
        },
        { status: 404 }
      );
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      role: user.role as UserRole,
    };

    const token = await generateToken(authUser);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: request.headers.get("user-agent") ?? null,
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          null,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "sessions",
        ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: authUser },
      message: "Login realizado com sucesso",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Phiz] Login error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao fazer login" },
      { status: 500 }
    );
  }
}
