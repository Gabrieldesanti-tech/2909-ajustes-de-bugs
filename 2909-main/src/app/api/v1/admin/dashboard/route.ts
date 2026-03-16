// =============================================================================
// GET /api/v1/admin/dashboard
// Dados do dashboard administrativo
// =============================================================================

import { NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import {
  getDashboardStats,
  getsByStatusChart,
  getsByPeriod,
  getsByCategory,
  getsByNeighborhood,
} from "@/lib/requests";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !isStaff(user)) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const [stats, byStatus, byPeriod, byCategory, byNeighborhood] =
      await Promise.all([
        getDashboardStats(),
        getsByStatusChart(),
        getsByPeriod(30),
        getsByCategory(),
        getsByNeighborhood(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        charts: {
          byStatus,
          byPeriod,
          byCategory,
          byNeighborhood,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}