import { NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const secretarias = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { requests: true, categories: true } },
      },
    });

    return NextResponse.json({ success: true, data: secretarias });
  } catch (error) {
    console.error("Erro ao listar secretarias:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
