"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";

// =============================================================================
// Página de Gestão de Solicitações (Admin)
// =============================================================================
// Funcionalidades:
// - Listagem paginada com filtros avançados
// - Busca por protocolo ou descrição
// - Filtros: status, período, origem, SLA
// - Exportação de dados
// - Link para detalhe individual
// =============================================================================

interface RequestListItem {
  id: string;
  protocol: string;
  status: string;
  origin: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

export default function SolicitacoesPage() {
  const [requests, setRequests] = useState<RequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [slaBreached, setSlaBreached] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (slaBreached === "true") params.set("slaBreached", "true");
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/v1/requests?${params.toString()}`);
      
      if (res.status === 403 || res.status === 401) {
        // Sessão expirada ou inválida - redirecionar para login
        window.location.href = "/auth?redirect=/admin/solicitacoes";
        return;
      }

      const json = await res.json();
      
      if (json.success) {
        setRequests(json.data || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 0);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setLoading(false);
    }
  }, [search, status, dateFrom, dateTo, slaBreached, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSlaBreached("");
    setPage(1);
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    params.set("format", "csv");
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (status) params.set("status", status);
    window.open(`/api/v1/admin/reports/export?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solicitações</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} solicitação{total !== 1 ? "ões" : ""} encontrada{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            Exportar CSV
          </button>
          <button
            onClick={fetchRequests}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Recarregar"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por protocolo ou descrição..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${
              showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} />
            Filtros
          </button>
        </form>

        {/* Filtros avançados */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data início</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data fim</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SLA</label>
              <select
                value={slaBreached}
                onChange={(e) => { setSlaBreached(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                <option value="true">SLA Expirado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de solicitações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            Carregando...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma solicitação encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Protocolo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Secretaria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Bairro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cidadão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">SLA</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-blue-600">
                        {req.protocol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-48">
                          {req.service.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {req.service.category.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-700 text-xs truncate max-w-36" title={req.department?.name || ""}>
                        {req.department?.name ? req.department.name.split(" - ")[1] || req.department.name.split(" - ")[0] : "—"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"
                      }`}>
                        {STATUS_LABELS[req.status] || req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {req.address?.neighborhood || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-800 truncate max-w-32">
                        {req.user?.name || "Anônimo"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      {req.slaBreached ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                          <AlertTriangle size={14} />
                          Expirado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <Clock size={14} />
                          No prazo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/admin/solicitacoes/${req.protocol}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye size={14} />
                        Ver
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
            <p className="text-sm text-gray-600">
              Página {page} de {totalPages} ({total} resultados)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {/* Números de página */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
