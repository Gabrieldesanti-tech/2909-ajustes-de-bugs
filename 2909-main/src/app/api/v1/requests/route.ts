// =============================================================================
// API de Solicitações
// POST /api/v1/requests - Criar nova solicitação
// GET  /api/v1/requests - Listar solicitações (admin)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { create, lists } from "@/lib/requests";
import { sanitizeHTML } from "@/lib/utils";
import prisma from "@/lib/db";

// POST - Criar solicitação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { serviceId } = body;
    const { serviceSlug, categorySlug, description, address, isAnonymous, origin } = body;

    if (!serviceId && serviceSlug && categorySlug) {
      const category = await prisma.serviceCategory.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        const service = await prisma.service.findFirst({
          where: { slug: serviceSlug, categoryId: category.id },
        });
        if (service) serviceId = service.id;
      }
    }

    if (!serviceId && serviceSlug) {
      const service = await prisma.service.findFirst({
        where: { slug: serviceSlug },
      });
      if (service) serviceId = service.id;
    }

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Serviço não encontrado" },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: "Descrição deve ter pelo menos 20 caracteres" },
        { status: 400 }
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Descrição deve ter no máximo 5000 caracteres" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const result = await create({
      userId: user?.id,
      serviceId,
      description: sanitizeHTML(description.trim()),
      address: address || undefined,
      isAnonymous: isAnonymous || false,
      origin: origin || "PORTAL",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { protocol: result.protocol },
        message: "Solicitação criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Listar solicitações (requer autenticação staff)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !isStaff(user)) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const filters = {
      status: searchParams.get("status") || undefined,
      serviceId: searchParams.get("serviceId") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      neighborhood: searchParams.get("neighborhood") || undefined,
      origin: searchParams.get("origin") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      slaBreached: searchParams.get("slaBreached") === "true" ? true : undefined,
      assigneeId: searchParams.get("assigneeId") || undefined,
      departmentId: searchParams.get("departmentId") || undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "20"), 100),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    const result = await lists(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}