// =============================================================================
// Compatibilidade: GET /api/requests/:protocol
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getPublicRequestByProtocol } from "@/lib/requests";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ protocol: string }> }
) {
  try {
    const { protocol } = await params;

    if (!protocol || protocol.length < 6) {
      return NextResponse.json(
        { success: false, error: "Protocolo inválido" },
        { status: 400 }
      );
    }

    const data = await getPublicRequestByProtocol(protocol);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Protocolo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
