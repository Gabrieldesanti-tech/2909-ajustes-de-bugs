// =============================================================================
// API de Gestão de Usuários (Admin)
// GET   /api/v1/admin/users - Listar usuários
// PATCH /api/v1/admin/users - Atualizar usuário
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasMinRole } from "@/lib/auth";
import prisma from "@/lib/db";

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !hasMinRole(user.role, "ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const role = searchParams.get("role") || undefined;
    const search = searchParams.get("search") || undefined;

    const where: Record<string, unknown> = { deletedAt: null };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { cpf: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: where as never,
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { requests: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where: where as never }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar perfil de usuário
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasMinRole(currentUser.role, "ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData as never,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: "UPDATE",
        entity: "users",
        entityId: userId,
        newValues: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Usuário atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
