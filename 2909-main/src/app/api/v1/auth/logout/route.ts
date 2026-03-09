// =============================================================================
// POST /api/v1/auth/logout
// Encerramento de sessão
// =============================================================================

import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST() {
  try {
    await logoutUser();

    const response = NextResponse.json({
      success: true,
      message: "Sessão encerrada com sucesso",
    });

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao encerrar sessão" },
      { status: 500 }
    );
  }
}
