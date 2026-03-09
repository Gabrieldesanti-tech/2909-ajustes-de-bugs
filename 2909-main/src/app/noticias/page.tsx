"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Newspaper, Calendar, Tag, ArrowRight, RefreshCw, Search } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  author: string;
  publishedAt: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Educação": { bg: "bg-blue-100", text: "text-blue-700" },
  "Saúde": { bg: "bg-green-100", text: "text-green-700" },
  "Infraestrutura": { bg: "bg-orange-100", text: "text-orange-700" },
  "Obras": { bg: "bg-amber-100", text: "text-amber-700" },
  "Segurança": { bg: "bg-red-100", text: "text-red-700" },
  "Desenvolvimento Social": { bg: "bg-purple-100", text: "text-purple-700" },
  "Governo": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Tributos": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Urbanismo": { bg: "bg-cyan-100", text: "text-cyan-700" },
};

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/public/news");
      const json = await res.json();
      if (json.success) setNews(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const categories = [...new Set(news.map(n => n.category))];

  const filtered = news.filter(n => {
    if (categoryFilter && n.category !== categoryFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div style={{ backgroundColor: "#1748ae" }} className="text-white py-12 md:py-16">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl"><Newspaper size={32} /></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Notícias</h1>
              <p className="text-blue-200 text-sm mt-1">Prefeitura Municipal de Belford Roxo</p>
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mt-4">
            Fique por dentro das últimas novidades, obras, programas e ações da prefeitura.
          </p>
        </div>
      </div>

      <div className="container-main py-10 space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar notícias..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setCategoryFilter("")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!categoryFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Todas
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3" />Carregando notícias...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-gray-500">Nenhuma notícia encontrada</p>
          </div>
        ) : (
          <>
            {/* Destaque - primeira notícia */}
            {filtered.length > 0 && !search && !categoryFilter && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    {(() => { const c = CATEGORY_COLORS[filtered[0].category] || { bg: "bg-gray-100", text: "text-gray-700" };
                      return <span className={`${c.bg} ${c.text} px-2.5 py-1 rounded text-xs font-medium`}>{filtered[0].category}</span>;
                    })()}
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} />{formatDate(filtered[0].publishedAt)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{filtered[0].title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{filtered[0].excerpt}</p>
                  <button onClick={() => setExpandedId(expandedId === filtered[0].id ? null : filtered[0].id)}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
                    {expandedId === filtered[0].id ? "Fechar" : "Ler mais"} <ArrowRight size={16} />
                  </button>
                  {expandedId === filtered[0].id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line">
                      {filtered[0].content}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de notícias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || categoryFilter ? filtered : filtered.slice(1)).map(item => {
                const catColor = CATEGORY_COLORS[item.category] || { bg: "bg-gray-100", text: "text-gray-700" };
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-2" style={{ backgroundColor: catColor.text === "text-blue-700" ? "#3b82f6" : catColor.text === "text-green-700" ? "#22c55e" : catColor.text === "text-orange-700" ? "#f97316" : catColor.text === "text-red-700" ? "#ef4444" : catColor.text === "text-purple-700" ? "#8b5cf6" : "#6b7280" }} />
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${catColor.bg} ${catColor.text} px-2 py-0.5 rounded text-xs font-medium`}>{item.category}</span>
                        <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2 text-sm leading-snug">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1">{item.excerpt}</p>
                      <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="mt-4 inline-flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors">
                        {expandedId === item.id ? "Fechar" : "Ler mais"} <ArrowRight size={14} />
                      </button>
                      {expandedId === item.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                          {item.content}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Fonte */}
        <div className="text-center text-xs text-gray-400 pt-4">
          Fonte: Prefeitura Municipal de Belford Roxo · Secretaria de Comunicação Social (SECOM)
        </div>
      </div>
    </div>
  );
}
