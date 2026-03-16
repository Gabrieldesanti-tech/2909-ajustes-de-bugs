// =============================================================================
// Compatibilidade: Redireciona para API v1
// POST /api/auth/login -> /api/v1/auth/login
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { validateCPF } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cpf, password } = body;

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

    const result = await loginUser(cpf, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: { user: result.user },
      message: "Login realizado com sucesso",
    });

    response.cookies.set("auth_token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
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
