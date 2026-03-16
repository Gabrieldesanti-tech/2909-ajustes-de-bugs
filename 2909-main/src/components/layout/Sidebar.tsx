"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceCategories } from "@/data/services";
import { Menu, Star, Loader2 } from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";

interface CategoryFromApi {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  services: { id: string; name: string; slug: string }[];
}

interface SidebarProps {
  activeCategory?: string;
}

export default function Sidebar({ activeCategory }: SidebarProps) {
  const [showAll, setShowAll] = useState(true);
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryFromApi[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/services")
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) setCategories(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const list = categories ?? serviceCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description ?? null, services: c.services.map((s) => ({ id: s.id, name: s.name, slug: s.slug })) }));

  const mostRequested = [
    { name: "Buraco na Rua", slug: "conservacao/buraco-rua", icon: "Wrench" },
    { name: "Iluminação Pública", slug: "iluminacao/iluminacao-publica", icon: "Lightbulb" },
    { name: "Coleta de Lixo", slug: "limpeza-urbana/coleta-lixo", icon: "Trash2" },
    { name: "Poda de Árvore", slug: "conservacao/poda-arvore", icon: "Wrench" },
    { name: "Foco de Dengue", slug: "saude/dengue", icon: "Stethoscope" },
    { name: "Maus Tratos a Animais", slug: "animais/maus-tratos", icon: "Dog" },
  ];

  return (
    <aside className="w-full lg:w-[340px] shrink-0">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tabs - estilo 1746 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setShowAll(true)}
            className={`flex-1 px-4 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              showAll
                ? "bg-gray-100 border-b-2"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            style={showAll ? { color: '#1748ae', borderBottomColor: '#1748ae' } : {}}
          >
            <Menu size={18} />
            <span>Todos os serviços</span>
          </button>
          <button
            onClick={() => setShowAll(false)}
            className={`flex-1 px-4 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              !showAll
                ? "bg-gray-100 border-b-2"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            style={!showAll ? { color: '#1748ae', borderBottomColor: '#1748ae' } : {}}
          >
            <Star size={18} />
            <span>Mais solicitados</span>
          </button>
        </div>

        {/* Lista de categorias */}
        <nav className="p-3 max-h-[600px] overflow-y-auto scrollbar-thin">
          {showAll ? (
            <ul className="space-y-1">
              {loading ? (
                <li className="flex items-center justify-center py-8 text-[#1748ae]">
                  <Loader2 size={24} className="animate-spin" aria-hidden />
                </li>
              ) : (
                list.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  const isActive = pathname === `/servicos/${category.slug}` || activeCategory === category.slug;

                  return (
                    <li key={category.id}>
                      <Link
                        href={`/servicos/${category.slug}`}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm transition-all ${
                          isActive ? "font-semibold" : "hover:bg-gray-50"
                        }`}
                        style={{
                          color: "#1748ae",
                          backgroundColor: isActive ? "rgba(23, 72, 174, 0.08)" : undefined,
                        }}
                      >
                        <Icon size={22} className="shrink-0 opacity-80" />
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          ) : (
            // Serviços mais solicitados
            <ul className="space-y-1">
              {mostRequested.map((service) => {
                const Icon = getCategoryIcon(service.icon);
                
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/servicos/${service.slug}`}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm hover:bg-gray-50 transition-all"
                      style={{ color: '#1748ae' }}
                    >
                      <Icon size={22} className="shrink-0 opacity-80" />
                      <span>{service.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
}
