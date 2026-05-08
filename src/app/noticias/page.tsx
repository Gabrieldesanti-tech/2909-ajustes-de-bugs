"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Newspaper, Calendar, ArrowRight, RefreshCw, Search } from "lucide-react";
import { parseNewsContent, type NewsContentBlock } from "@/lib/news-content";
import type { ApiEnvelope, ApiPaginatedData, NewsItem } from "@/types";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [requestError, setRequestError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingNextPageRef = useRef(false);

  const fetchNewsPage = useCallback(async (pageToLoad: number) => {
    const isFirstPage = pageToLoad === 1;

    if (!isFirstPage && isFetchingNextPageRef.current) {
      return;
    }

    if (isFirstPage) {
      setLoading(true);
    } else {
      isFetchingNextPageRef.current = true;
      setLoadingMore(true);
    }

    setRequestError("");

    try {
      const params = new URLSearchParams({
        page: pageToLoad.toString(),
        limit: "9",
      });
      const res = await fetch(`/api/v1/public/news?${params.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as ApiEnvelope<ApiPaginatedData<NewsItem>>;
      const pageData = json.data;
      const items = Array.isArray(pageData?.data) ? pageData.data : [];

      if (!json.success) {
        throw new Error(json.error || "Não foi possível carregar as notícias.");
      }

      setNews((currentNews) => {
        const mergedNews = isFirstPage ? items : [...currentNews, ...items];
        return mergedNews.filter(
          (item, index, collection) => collection.findIndex((candidate) => candidate.id === item.id) === index
        );
      });

      const resolvedPage = pageData?.page ?? pageToLoad;
      const resolvedTotalPages = pageData?.totalPages ?? resolvedPage;

      setCurrentPage(resolvedPage);
      setHasMore(resolvedPage < resolvedTotalPages);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
      setRequestError("Não foi possível atualizar o feed agora.");
    } finally {
      if (isFirstPage) {
        setLoading(false);
      } else {
        isFetchingNextPageRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchNewsPage(1);
  }, [fetchNewsPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading || loadingMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void fetchNewsPage(currentPage + 1);
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentPage, fetchNewsPage, hasMore, loading, loadingMore]);

  const normalizedNews = useMemo(
    () =>
      news.map((item) => ({
        item,
        parsed: parseNewsContent(item),
      })),
    [news]
  );

  const categories = useMemo(
    () => [...new Set(normalizedNews.map(({ item }) => item.category).filter(Boolean))],
    [normalizedNews]
  );

  const filtered = useMemo(
    () =>
      normalizedNews.filter(({ item, parsed }) => {
        if (categoryFilter && item.category !== categoryFilter) {
          return false;
        }

        if (!search) {
          return true;
        }

        const searchTerm = search.toLowerCase();
        return [item.title.toLowerCase(), parsed.excerptText.toLowerCase(), parsed.searchText].some((candidate) =>
          candidate.includes(searchTerm)
        );
      }),
    [categoryFilter, normalizedNews, search]
  );

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const featuredNews = !search && !categoryFilter ? filtered[0] : null;
  const remainingNews = featuredNews ? filtered.slice(1) : filtered;
  const showEmptyState = filtered.length === 0 && !hasMore;
  const showPendingFilterState = filtered.length === 0 && hasMore && news.length > 0;

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
        ) : requestError && news.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-gray-600">{requestError}</p>
          </div>
        ) : showEmptyState ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-gray-500">Nenhuma notícia encontrada</p>
          </div>
        ) : (
          <>
            {showPendingFilterState && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-500">Buscando mais notícias para esse filtro...</p>
              </div>
            )}

            {/* Destaque - primeira notícia */}
            {featuredNews && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {featuredNews.parsed.coverImage && (
                  <div className="aspect-[16/7] bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredNews.parsed.coverImage}
                      alt={featuredNews.item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    {(() => { const c = CATEGORY_COLORS[featuredNews.item.category] || { bg: "bg-gray-100", text: "text-gray-700" };
                      return <span className={`${c.bg} ${c.text} px-2.5 py-1 rounded text-xs font-medium`}>{featuredNews.item.category}</span>;
                    })()}
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} />{formatDate(featuredNews.item.publishedAt)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{featuredNews.item.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {featuredNews.parsed.excerptText || "Toque em ler mais para abrir o conteúdo."}
                  </p>
                  <button onClick={() => setExpandedId(expandedId === featuredNews.item.id ? null : featuredNews.item.id)}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
                    {expandedId === featuredNews.item.id ? "Fechar" : "Ler mais"} <ArrowRight size={16} />
                  </button>
                  {expandedId === featuredNews.item.id && (
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <NewsBlocks blocks={featuredNews.parsed.blocks.slice(0, 8)} />
                      {featuredNews.parsed.hasOverflow && (
                        <p className="mt-4 text-sm text-gray-500">
                          O feed mostra uma versão resumida desta notícia para leitura rápida.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de notícias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingNews.map(({ item, parsed }) => {
                const catColor = CATEGORY_COLORS[item.category] || { bg: "bg-gray-100", text: "text-gray-700" };
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    {parsed.coverImage ? (
                      <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={parsed.coverImage}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-2" style={{ backgroundColor: catColor.text === "text-blue-700" ? "#3b82f6" : catColor.text === "text-green-700" ? "#22c55e" : catColor.text === "text-orange-700" ? "#f97316" : catColor.text === "text-red-700" ? "#ef4444" : catColor.text === "text-purple-700" ? "#8b5cf6" : "#6b7280" }} />
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${catColor.bg} ${catColor.text} px-2 py-0.5 rounded text-xs font-medium`}>{item.category}</span>
                        <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2 text-sm leading-snug">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1">
                        {parsed.excerptText || "Abra a notícia para ver os principais trechos."}
                      </p>
                      <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="mt-4 inline-flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors">
                        {expandedId === item.id ? "Fechar" : "Ler mais"} <ArrowRight size={14} />
                      </button>
                      {expandedId === item.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <NewsBlocks blocks={parsed.blocks.slice(0, 6)} compact />
                          {parsed.hasOverflow && (
                            <p className="mt-3 text-[11px] text-gray-500">
                              Exibindo os principais trechos desta notícia no feed.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {requestError && news.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {requestError}
              </div>
            )}

            {hasMore && (
              <div ref={sentinelRef} className="h-16 flex items-center justify-center">
                {loadingMore ? (
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw size={16} className="animate-spin" />
                    Carregando mais notícias...
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Role para carregar mais</span>
                )}
              </div>
            )}
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

function NewsBlocks({
  blocks,
  compact = false,
}: {
  blocks: NewsContentBlock[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {blocks.map((block) => {
        if (block.type === "image") {
          return (
            <figure key={block.id} className="space-y-2">
              <div className={`overflow-hidden rounded-2xl bg-slate-100 ${compact ? "max-h-48" : "max-h-[28rem]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {block.caption && (
                <figcaption className={`${compact ? "text-[11px]" : "text-sm"} text-gray-500 leading-relaxed`}>
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "heading") {
          return (
            <h3
              key={block.id}
              className={`${compact ? "text-sm" : "text-lg"} font-semibold text-gray-900 leading-snug`}
            >
              {block.text}
            </h3>
          );
        }

        return (
          <p
            key={block.id}
            className={`${compact ? "text-xs" : "text-sm"} text-gray-700 leading-relaxed`}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
