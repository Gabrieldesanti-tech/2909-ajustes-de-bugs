import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as never,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: where as never }),
    ]);

    return NextResponse.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Erro ao listar auditoria:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
