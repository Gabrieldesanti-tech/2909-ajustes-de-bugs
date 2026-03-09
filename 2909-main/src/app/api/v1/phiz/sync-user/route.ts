// =============================================================================
// POST /api/v1/phiz/sync-user
// Recebe dados do usuário Phiz do miniprogram.
// Se já existe: retorna token direto.
// Se não existe: cria automaticamente e retorna token.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { generateToken } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import type { UserRole } from "@/types";

interface PhizUserPayload {
  userId: string;
  nickname?: string;
  avatarUrl?: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PhizUserPayload;
    const { userId: phizUserId, nickname, phone } = body;

    if (!phizUserId || typeof phizUserId !== "string") {
      return NextResponse.json(
        { success: false, error: "userId obrigatório" },
        { status: 400 }
      );
    }

    // Busca usuário existente pelo phizUserId
    let user = await prisma.user.findFirst({
      where: { phizUserId, isActive: true, deletedAt: null } as Prisma.UserWhereInput,
    });

    // Se não existe, cria automaticamente com dados do Phiz
    if (!user) {
      const name = nickname || "Usuário Phiz"
      const email = `phiz_${phizUserId}@portal2909.app`
      const cpf = `phiz_${phizUserId.slice(0, 11).padEnd(11, '0')}`

      // Verifica se já existe usuário com esse email gerado
      const emailExists = await prisma.user.findUnique({ where: { email } })
      if (emailExists) {
        // Atualiza o phizUserId se o email já existe
        user = await prisma.user.update({
          where: { email },
          data: { phizUserId } as Prisma.UserUpdateInput,
        })
      } else {
        user = await prisma.user.create({
          data: {
            name,
            email,
            cpf,
            phone: phone || null,
            passwordHash: randomUUID(), // senha aleatória — login só via Phiz
            role: "CITIZEN",
            isActive: true,
            phizUserId,
          } as Prisma.UserCreateInput,
        })
      }

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE",
          entity: "users",
          entityId: user.id,
          newValues: JSON.stringify({ phizUserId, name, origin: "miniprogram" }),
          ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      })
    }

    // Gera token de sessão
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      role: user.role as UserRole,
    }

    const token = await generateToken(authUser)

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: request.headers.get("user-agent") ?? null,
        ipAddress: request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ?? null,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "sessions",
        ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: { token, user: authUser },
      message: "Login realizado com sucesso",
    })

  } catch (error) {
    console.error("[Phiz] Sync-user error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}