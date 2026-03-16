import { NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error("Erro ao listar FAQs:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
