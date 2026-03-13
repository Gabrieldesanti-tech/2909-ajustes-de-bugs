// =============================================================================
// API Pública de Serviços
// GET /api/v1/services - Lista categorias e serviços do banco
// =============================================================================

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        department: { select: { id: true, name: true, slug: true } },
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            slaHours: true,
            slaPriority: true,
            requiresAuth: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        secretaria: cat.department
          ? {
              id: cat.department.id,
              name: cat.department.name,
              sigla: cat.department.slug.toUpperCase(),
            }
          : null,
        services: cat.services,
      })),
    });
  } catch (error) {
    console.error("Erro detalhado ao listar serviços:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
