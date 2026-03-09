// =============================================================================
// Compatibilidade: POST /api/auth/logout
// =============================================================================

import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST() {
  try {
    await logoutUser();
    const response = NextResponse.json({ success: true, message: "Sessão encerrada" });
    response.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Erro ao encerrar sessão" }, { status: 500 });
  }
}
