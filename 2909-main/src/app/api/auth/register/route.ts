// =============================================================================
// Compatibilidade: POST /api/auth/register
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { validateCPF, validateEmail } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cpf, email, phone, password, confirmPassword } = body;

    const errors: string[] = [];
    if (!name || name.trim().length < 3) errors.push("Nome deve ter pelo menos 3 caracteres");
    if (!cpf || !validateCPF(cpf)) errors.push("CPF inválido");
    if (!email || !validateEmail(email)) errors.push("E-mail inválido");
    if (!password || password.length < 8) errors.push("Senha deve ter pelo menos 8 caracteres");
    if (password !== confirmPassword) errors.push("As senhas não coincidem");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, error: errors.join("; ") }, { status: 400 });
    }

    const result = await registerUser({ name, cpf, email, phone: phone || "", password });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json(
      { success: true, data: { userId: result.userId }, message: "Conta criada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
