import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Erro ao listar notícias:", error);
    // Retornar array vazio em vez de erro 500
    return NextResponse.json({ success: true, data: [] });
  }
}
