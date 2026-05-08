"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Newspaper, Calendar, ArrowRight, RefreshCw, Search, ImageIcon } from "lucide-react";
import { parseNewsContent, type ParsedNewsContent } from "@/lib/news-content";
import type { ApiEnvelope, ApiPaginatedData, NewsItem } from "@/types";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  "Educação": { bg: "bg-blue-100", text: "text-blue-700", accent: "#3b82f6" },
  "Saúde": { bg: "bg-green-100", text: "text-green-700", accent: "#22c55e" },
  "Infraestrutura": { bg: "bg-orange-100", text: "text-orange-700", accent: "#f97316" },
  "Obras": { bg: "bg-amber-100", text: "text-amber-700", accent: "#f59e0b" },
  "Segurança": { bg: "bg-red-100", text: "text-red-700", accent: "#ef4444" },
  "Desenvolvimento Social": { bg: "bg-purple-100", text: "text-purple-700", accent: "#8b5cf6" },
  "Governo": { bg: "bg-indigo-100", text: "text-indigo-700", accent: "#6366f1" },
  "Tributos": { bg: "bg-yellow-100", text: "text-yellow-700", accent: "#eab308" },
  "Urbanismo": { bg: "bg-cyan-100", text: "text-cyan-700", accent: "#06b6d4" },
};

const PAGE_SIZE = 9;

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mergeNewsPages(current: NewsItem[], incoming: NewsItem[]): NewsItem[] {
  const seen = new Set(current.map((item) => item.id));
  const merged = [...current];

  incoming.forEach((item) => {
    if (!seen.has(item.id)) {
      merged.push(item);
      seen.add(item.id);
    }
  });

  return merged;
}

function NewsLoadingSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-72 animate-pulse bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />
        <div className="space-y-4 p-8">
          <div className="h-4 w-32 animate-pulse rounded-full bg-gray-100" />
          <div className="h-8 w-3/4 animate-pulse rounded-xl bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-lg bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="h-48 animate-pulse bg-gray-100" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-24 animate-pulse rounded-full bg-gray-100" />
              <div className="h-5 w-full animate-pulse rounded-lg bg-gray-100" />
              <div className="h-5 w-4/5 animate-pulse rounded-lg bg-gray-100" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full animate-pulse rounded-lg bg-gray-100" />
                <div className="h-3 w-5/6 animate-pulse rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsPreviewContent({ parsed }: { parsed: ParsedNewsContent }) {
  if (parsed.blocks.length === 0) {
    return <p className="text-sm leading-7 text-gray-600">Conteudo indisponivel para visualizacao.</p>;
  }

  return (
    <div className="space-y-4">
      {parsed.blocks.map((block, index) => {
        if (block.type === "image") {
          return (
            <figure
              key={`${block.src}-${index}`}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
            >
              <img src={block.src} alt={block.alt} className="h-auto w-full object-cover" />
              {block.caption && (
                <figcaption className="border-t border-gray-100 px-4 py-3 text-xs leading-relaxed text-gray-500">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "subheading") {
          return (
            <h3 key={`${block.text}-${index}`} className="text-base font-semibold text-gray-900">
              {block.text}
            </h3>
          );
        }

        return (
          <p
            key={`${block.text}-${index}`}
            className={`text-sm leading-7 text-gray-700 ${block.emphasis ? "font-medium text-gray-800" : ""}`}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const hasMore = page < totalPages;

  const parsedNews = useMemo(() => {
    const entries = new Map<string, ParsedNewsContent>();

    news.forEach((item) => {
      entries.set(item.id, parseNewsContent(item.content));
    });

    return entries;
  }, [news]);

  const fetchNewsPage = useCallback(async (pageToLoad: number) => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    const isFirstPage = pageToLoad === 1;

    if (isFirstPage) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(pageToLoad),
        limit: String(PAGE_SIZE),
      });

      const response = await fetch(`/api/v1/public/news?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar as noticias.");
      }

      const json = (await response.json()) as ApiEnvelope<ApiPaginatedData<NewsItem>>;

      if (!json.success || !json.data) {
        throw new Error(json.message || json.error || "Nao foi possivel carregar as noticias.");
      }

      setNews((current) =>
        pageToLoad === 1 ? json.data!.data : mergeNewsPages(current, json.data!.data)
      );
      setPage(json.data.page);
      setTotalPages(json.data.totalPages);
    } catch (fetchError) {
      console.error("Erro ao carregar noticias:", fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Nao foi possivel carregar as noticias."
      );
    } finally {
      if (isFirstPage) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }

      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void fetchNewsPage(1);
  }, [fetchNewsPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && !isFetchingRef.current && !loadingMore && !initialLoading && !error) {
          void fetchNewsPage(page + 1);
        }
      },
      {
        rootMargin: "240px 0px",
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [error, fetchNewsPage, hasMore, initialLoading, loadingMore, page]);

  const categories = useMemo(
    () =>
      [...new Set(news.map((item) => item.category).filter(Boolean))].sort((left, right) =>
        left.localeCompare(right, "pt-BR")
      ),
    [news]
  );

  const filteredNews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return news.filter((item) => {
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const parsedText = (parsedNews.get(item.id)?.blocks || [])
        .map((block) => {
          if (block.type === "image") {
            return [block.alt, block.caption].filter(Boolean).join(" ");
          }

          return block.text;
        })
        .join(" ")
        .toLowerCase();

      const haystacks = [item.title, item.excerpt, parsedText].map((value) => value.toLowerCase());
      return haystacks.some((value) => value.includes(normalizedSearch));
    });
  }, [categoryFilter, news, parsedNews, search]);

  const featuredNews = filteredNews[0];
  const gridNews = search || categoryFilter ? filteredNews : filteredNews.slice(1);
  const canRetryMore = news.length > 0 && error;
  const showEmptyState = !initialLoading && filteredNews.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: "#1748ae" }} className="py-12 text-white md:py-16">
        <div className="container-main">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <Newspaper size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Notícias</h1>
              <p className="mt-1 text-sm text-blue-200">Prefeitura Municipal de Belford Roxo</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Fique por dentro das últimas novidades, obras, programas e ações da prefeitura.
          </p>
        </div>
      </div>

      <div className="container-main space-y-6 py-10">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar noticias carregadas no feed..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  !categoryFilter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoryFilter === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {initialLoading ? (
          <NewsLoadingSkeleton />
        ) : error && news.length === 0 ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-semibold text-gray-800">Nao foi possivel carregar as noticias</p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => void fetchNewsPage(1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        ) : showEmptyState ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-400 shadow-sm">
            <Newspaper size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-gray-500">Nenhuma noticia encontrada</p>
          </div>
        ) : (
          <>
            {featuredNews && !search && !categoryFilter && (
              <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
                  <div className="relative min-h-[280px] bg-slate-100">
                    {(() => {
                      const preview = featuredNews.image || parsedNews.get(featuredNews.id)?.previewImage?.src;

                      if (!preview) {
                        return (
                          <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-400">
                            <div className="text-center">
                              <ImageIcon size={36} className="mx-auto mb-3" />
                              <p className="text-sm font-medium">Imagem em destaque indisponivel</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <img
                          src={preview}
                          alt={featuredNews.title}
                          className="h-full min-h-[280px] w-full object-cover"
                        />
                      );
                    })()}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-6 text-white lg:hidden">
                      <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                        {featuredNews.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {(() => {
                        const color = CATEGORY_COLORS[featuredNews.category] || {
                          bg: "bg-gray-100",
                          text: "text-gray-700",
                          accent: "#6b7280",
                        };

                        return (
                          <span className={`${color.bg} ${color.text} rounded-full px-3 py-1 text-xs font-medium`}>
                            {featuredNews.category}
                          </span>
                        );
                      })()}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {formatDate(featuredNews.publishedAt)}
                      </span>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold text-gray-900">{featuredNews.title}</h2>
                    <p className="mb-5 text-sm leading-7 text-gray-600">{featuredNews.excerpt}</p>

                    <button
                      onClick={() =>
                        setExpandedId(expandedId === featuredNews.id ? null : featuredNews.id)
                      }
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      {expandedId === featuredNews.id ? "Fechar leitura" : "Ler mais"}
                      <ArrowRight size={16} />
                    </button>

                    {expandedId === featuredNews.id && (
                      <div className="mt-6 border-t border-gray-100 pt-6">
                        <NewsPreviewContent
                          parsed={parsedNews.get(featuredNews.id) || { blocks: [] }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridNews.map((item) => {
                const color = CATEGORY_COLORS[item.category] || {
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                  accent: "#6b7280",
                };
                const parsed = parsedNews.get(item.id) || { blocks: [] };
                const preview = item.image || parsed.previewImage?.src;

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {preview ? (
                        <img
                          src={preview}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-400">
                          <div className="text-center">
                            <ImageIcon size={28} className="mx-auto mb-2" />
                            <p className="text-xs font-medium">Sem imagem disponivel</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: color.accent }} />
                    </div>

                    <div className="flex h-full flex-col p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`${color.bg} ${color.text} rounded-full px-2.5 py-1 text-[11px] font-medium`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                      </div>

                      <h3 className="mb-2 text-base font-bold leading-snug text-gray-900">{item.title}</h3>
                      <p className="flex-1 text-sm leading-6 text-gray-500">{item.excerpt}</p>

                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                      >
                        {expandedId === item.id ? "Fechar leitura" : "Ler mais"}
                        <ArrowRight size={14} />
                      </button>

                      {expandedId === item.id && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <NewsPreviewContent parsed={parsed} />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="space-y-4">
              {canRetryMore && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>
                    <button
                      onClick={() => void fetchNewsPage(page + 1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100"
                    >
                      <RefreshCw size={14} />
                      Tentar carregar mais
                    </button>
                  </div>
                </div>
              )}

              {loadingMore && (
                <div className="flex items-center justify-center gap-3 py-4 text-sm text-gray-500">
                  <RefreshCw size={18} className="animate-spin" />
                  Carregando mais noticias...
                </div>
              )}

              {!loadingMore && !error && !hasMore && news.length > 0 && (
                <div className="py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                  Voce chegou ao fim do feed
                </div>
              )}

              <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
            </div>
          </>
        )}

        <div className="pt-4 text-center text-xs text-gray-400">
          Fonte: Prefeitura Municipal de Belford Roxo · Secretaria de Comunicação Social (SECOM)
        </div>
      </div>
    </div>
  );
}
