// =============================================================================
// POST /api/v1/phiz/miniprogram-login
// Login direto via phizUserId — usado pelo miniprogram PhizClip
// Nao requer scan_token pois o usuario ja esta autenticado no app Phiz
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { generateToken } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import type { UserRole } from "@/types";

const COOKIE_NAME = "auth_token";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phizUserId } = body as { phizUserId?: string };

        if (!phizUserId || typeof phizUserId !== "string") {
            return NextResponse.json(
                { success: false, error: "phizUserId obrigatorio" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                phizUserId,
                isActive: true,
                deletedAt: null,
            } as Prisma.UserWhereInput,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Conta nao vinculada",
                    code: "PHIZ_NOT_LINKED",
                    message:
                        "Sua conta Phiz ainda nao esta vinculada. Cadastre-se em belfordroxo.rj.gov.br e vincule nas configuracoes.",
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
        console.error("[Phiz] Miniprogram login error:", error);
        return NextResponse.json(
            { success: false, error: "Erro interno ao fazer login" },
            { status: 500 }
        );
    }
}