"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  FolderOpen,
  RefreshCw,
  Search,
  Eye,
  Clock,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

interface SecretariaDetail {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  categories: {
    id: string;
    name: string;
    slug: string;
    services: { id: string; name: string; slug: string }[];
  }[];
  _count: { requests: number; categories: number };
  stats: {
    total: number;
    byStatus: Record<string, number>;
  };
}

interface RequestItem {
  id: string;
  protocol: string;
  status: string;
  origin: string;
  description: string;
  createdAt: string;
  slaBreached: boolean;
  slaDeadline: string;
  service: { name: string; category: { name: string } };
  address: { neighborhood: string } | null;
  user: { name: string; email: string } | null;
  assignee: { name: string } | null;
  department: { name: string } | null;
  _count: { attachments: number; comments: number };
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "PENDING", label: "Aguardando análise" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "WAITING_INFO", label: "Aguardando informações" },
  { value: "FORWARDED", label: "Encaminhado" },
  { value: "RESOLVED", label: "Resolvido" },
  { value: "CLOSED", label: "Encerrado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  WAITING_INFO: "bg-orange-100 text-orange-800",
  FORWARDED: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  REOPENED: "bg-cyan-100 text-cyan-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando",
  IN_PROGRESS: "Em andamento",
  WAITING_INFO: "Aguard. info",
  FORWARDED: "Encaminhado",
  RESOLVED: "Resolvido",
  CLOSED: "Encerrado",
  CANCELLED: "Cancelado",
  REOPENED: "Reaberto",
};

const STAT_CARD_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-500" },
  IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" },
  RESOLVED: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
  CLOSED: { bg: "bg-gray-50", text: "text-gray-700", icon: "text-gray-500" },
};

export default function SecretariaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [secretaria, setSecretaria] = useState<SecretariaDetail | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Buscar detalhes da secretaria
  const fetchSecretaria = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/secretarias/${slug}`);
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/secretarias"; return; }
      if (res.status === 404) { setSecretaria(null); setLoading(false); return; }
      const json = await res.json();
      if (json.success) setSecretaria(json.data);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, [slug]);

  // Buscar solicitações da secretaria
  const fetchRequests = useCallback(async () => {
    if (!secretaria) return;
    setLoadingReqs(true);
    try {
      const p = new URLSearchParams();
      p.set("departmentId", secretaria.id);
      if (search) p.set("search", search);
      if (status) p.set("status", status);
      p.set("page", page.toString());
      p.set("limit", limit.toString());

      const res = await fetch(`/api/v1/requests?${p}`);
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/secretarias"; return; }
      const json = await res.json();
      if (json.success) {
        setRequests(json.data || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 0);
      }
    } catch (e) { console.error("Erro:", e); }
    finally { setLoadingReqs(false); }
  }, [secretaria, search, status, page]);

  useEffect(() => { fetchSecretaria(); }, [fetchSecretaria]);
  useEffect(() => { if (secretaria) fetchRequests(); }, [secretaria, fetchRequests]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchRequests(); };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <RefreshCw size={28} className="animate-spin mx-auto mb-3" />
          <p>Carregando secretaria...</p>
        </div>
      </div>
    );
  }

  if (!secretaria) {
    return (
      <div className="text-center py-20">
        <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Secretaria não encontrada</h2>
        <Link href="/admin/secretarias" className="text-blue-600 hover:underline text-sm">Voltar para lista</Link>
      </div>
    );
  }

  const parts = secretaria.name.split(" - ");
  const nome = parts[0];
  const sigla = parts[1] || secretaria.slug.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start gap-4">
        <Link href="/admin/secretarias" className="mt-1 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800">{nome}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded">{sigla}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {secretaria.email && (
              <span className="flex items-center gap-1"><Mail size={14} />{secretaria.email}</span>
            )}
            {secretaria.phone && (
              <span className="flex items-center gap-1"><Phone size={14} />{secretaria.phone}</span>
            )}
            <span className="flex items-center gap-1">
              <FolderOpen size={14} />{secretaria._count.categories} categoria{secretaria._count.categories !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{secretaria.stats.total}</p>
        </div>
        {(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map(st => {
          const colors = STAT_CARD_COLORS[st];
          return (
            <div key={st} className={`${colors.bg} rounded-xl border border-gray-100 p-4`}>
              <p className={`text-xs font-medium ${colors.icon}`}>{STATUS_LABELS[st]}</p>
              <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{secretaria.stats.byStatus[st] || 0}</p>
            </div>
          );
        })}
      </div>

      {/* Categorias vinculadas */}
      {secretaria.categories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FolderOpen size={16} className="text-gray-400" />Categorias de serviço vinculadas
          </h2>
          <div className="flex flex-wrap gap-2">
            {secretaria.categories.map(cat => (
              <span key={cat.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                {cat.name}
                <span className="text-gray-400">({cat.services.length})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filtros de solicitações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Solicitações desta secretaria</h2>
          <span className="ml-auto text-xs text-gray-500">{total} resultado{total !== 1 ? "s" : ""}</span>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por protocolo ou descrição..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none">
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </form>
      </div>

      {/* Tabela de solicitações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loadingReqs ? (
          <div className="p-8 text-center text-gray-500"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando solicitações...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium text-gray-500">Nenhuma solicitação encontrada</p>
            <p className="text-sm mt-1">Esta secretaria ainda não possui solicitações{status ? " com o filtro selecionado" : ""}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Protocolo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cidadão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Bairro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">SLA</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-blue-600">{req.protocol}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800 truncate max-w-48">{req.service.name}</p>
                      <p className="text-xs text-gray-500">{req.service.category.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status] || "bg-gray-100"}`}>
                        {STATUS_LABELS[req.status] || req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800 truncate max-w-32">{req.user?.name || "Anônimo"}</td>
                    <td className="py-3 px-4 text-gray-600">{req.address?.neighborhood || "—"}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{new Date(req.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 px-4">
                      {req.slaBreached ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium"><AlertTriangle size={14} />Expirado</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs"><Clock size={14} />No prazo</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link href={`/admin/solicitacoes/${req.protocol}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye size={14} />Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">Página {page} de {totalPages} ({total} resultados)</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-white"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
