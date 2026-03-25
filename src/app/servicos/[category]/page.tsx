"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, Loader2, Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { apiGet } from "@/lib/api";
import type { ApiEnvelope, CatalogCategorySummary } from "@/types";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;
  const [categoryData, setCategoryData] = useState<CatalogCategorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const payload = await apiGet<ApiEnvelope<CatalogCategorySummary>>(
          `/api/v1/catalog/categories/${category}`
        );
        const data = payload.data;
        if (!active) return;
        setCategoryData(data || null);
      } catch {
        if (!active) return;
        setMissing(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [category]);

  if (missing) {
    return (
      <div className="container-main py-12 text-center text-neutral-500">
        <p>Categoria não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeCategory={category} />

        <div className="flex-1">
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-neutral-500">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Portal 2909
                </Link>
              </li>
              <ChevronRight size={14} />
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <ChevronRight size={14} />
              <li className="text-primary font-medium">
                {categoryData?.name || "Carregando..."}
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Menu size={28} className="text-[#1748ae] shrink-0" aria-hidden />
                <h1 className="text-2xl font-bold text-neutral-800">
                  {categoryData?.name || "Carregando categoria"}
                </h1>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                <Bell size={16} />
                Seguir
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {loading ? (
                <div className="px-6 py-12 text-center text-neutral-500">
                  <Loader2 size={24} className="animate-spin mx-auto mb-3 text-[#1748ae]" />
                  <p>Carregando serviços...</p>
                </div>
              ) : (categoryData?.services || []).length > 0 ? (
                categoryData?.services?.map((service) => (
                  <Link
                    key={service.id}
                    href={`/servicos/${category}/${service.slug}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors group"
                  >
                    <div>
                      <h2 className="font-medium text-neutral-800 group-hover:text-primary transition-colors">
                        {service.name}
                      </h2>
                      {service.description && (
                        <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                      )}
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-neutral-400 group-hover:text-primary transition-colors"
                    />
                  </Link>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-neutral-500">
                  <p>Nenhum serviço cadastrado nesta categoria.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Voltar para todos os serviços
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
