import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !isStaff(user)) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { slug } = await params;

    const secretaria = await prisma.department.findUnique({
      where: { slug },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            services: { where: { isActive: true }, select: { id: true, name: true, slug: true } },
          },
          orderBy: { order: "asc" },
        },
        _count: { select: { requests: true, categories: true } },
      },
    });

    if (!secretaria) {
      return NextResponse.json({ success: false, error: "Secretaria não encontrada" }, { status: 404 });
    }

    // Contagem por status
    const statusCounts = await prisma.serviceRequest.groupBy({
      by: ["status"],
      where: { departmentId: secretaria.id },
      _count: { id: true },
    });

    const stats = {
      total: statusCounts.reduce((s, c) => s + c._count.id, 0),
      byStatus: Object.fromEntries(statusCounts.map(c => [c.status, c._count.id])),
    };

    return NextResponse.json({
      success: true,
      data: {
        id: secretaria.id,
        name: secretaria.name,
        slug: secretaria.slug,
        email: secretaria.email,
        phone: secretaria.phone,
        isActive: secretaria.isActive,
        categories: secretaria.categories,
        _count: secretaria._count,
        stats,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar secretaria:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
