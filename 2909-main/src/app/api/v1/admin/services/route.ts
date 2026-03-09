// =============================================================================
// API de Gestão de Serviços (Admin)
// GET  /api/v1/admin/services - Listar serviços
// POST /api/v1/admin/services - Criar serviço
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasMinRole } from "@/lib/auth";
import prisma from "@/lib/db";

// GET - Listar todos os serviços com categorias
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !hasMinRole(user.role, "ATTENDANT")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Erro ao listar serviços:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

// POST - Criar novo serviço
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !hasMinRole(user.role, "ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado. Requer perfil Admin." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description, categoryId, slaHours, slaPriority, requiresAuth, detailedInfo, fields } = body;

    if (!name || !slug || !description || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: name, slug, description, categoryId" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        slaHours: slaHours || 120,
        slaPriority: slaPriority || "NORMAL",
        requiresAuth: requiresAuth || false,
        detailedInfo: detailedInfo || undefined,
        fields: fields || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "services",
        entityId: service.id,
        newValues: JSON.stringify({ name, slug, categoryId }),
      },
    });

    return NextResponse.json(
      { success: true, data: service },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
