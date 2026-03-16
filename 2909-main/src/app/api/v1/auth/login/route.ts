// =============================================================================
// POST /api/v1/auth/login
// Autenticação de usuário com CPF e senha
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { validateCPF } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cpf, password } = body;

    // Validações
    if (!cpf || !password) {
      return NextResponse.json(
        { success: false, error: "CPF e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (!validateCPF(cpf)) {
      return NextResponse.json(
        { success: false, error: "CPF inválido" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Metadados da requisição
    const metadata = {
      ipAddress: request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    };

    const result = await loginUser(cpf, password, metadata);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Definir cookie httpOnly com o token
    const response = NextResponse.json({
      success: true,
      data: {
        token: result.token,   // ← adicionado
        user: result.user,
      },
      message: "Login realizado com sucesso",
    });

    response.cookies.set("auth_token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 horas
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
