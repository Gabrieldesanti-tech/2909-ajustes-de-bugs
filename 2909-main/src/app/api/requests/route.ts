// =============================================================================
// Compatibilidade: /api/requests -> usa lógica da v1
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createRequest } from "@/lib/requests";
import { sanitizeHTML } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, description, address, isAnonymous } = body;

    if (!serviceId || !description || description.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: "Serviço e descrição (min. 20 caracteres) são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const result = await createRequest({
      userId: user?.id,
      serviceId,
      description: sanitizeHTML(description.trim()),
      address: address || undefined,
      isAnonymous: isAnonymous || false,
      origin: "PORTAL",
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: { protocol: result.protocol }, message: "Solicitação criada" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
