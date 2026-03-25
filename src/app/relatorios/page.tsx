"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Activity, Users, FolderOpen, RefreshCw, Clock } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { ApiEnvelope, PublicStatsData } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando",
  IN_PROGRESS: "Em andamento",
  WAITING_INFO: "Aguardando info",
  FORWARDED: "Encaminhado",
  RESOLVED: "Resolvido",
  CLOSED: "Encerrado",
  CANCELLED: "Cancelado",
  REOPENED: "Reaberto",
};

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

export default function RelatoriosPublicosPage() {
  const [data, setData] = useState<PublicStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const json = await apiGet<ApiEnvelope<PublicStatsData>>("/api/v1/public/stats");
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData(null);
      }
    } catch (e) {
      console.error("Erro:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-500">Carregando indicadores...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Não foi possível carregar os indicadores públicos.
      </div>
    );
  }

  const sortedStatus = [...data.byStatus].sort((a, b) => b.count - a.count);
  const topStatus = sortedStatus[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: "#1748ae" }} className="text-white py-12 md:py-16">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <BarChart3 size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Relatórios e Indicadores</h1>
              <p className="text-blue-200 text-sm mt-1">Portal 2909 · Prefeitura de Belford Roxo</p>
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mt-4">
            Painel público com visão resumida do volume de solicitações e do catálogo de serviços.
          </p>
        </div>
      </div>

      <div className="container-main py-10 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Dados atualizados em {new Date().toLocaleString("pt-BR")}</p>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800">
            <RefreshCw size={14} />
            Atualizar
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Activity size={18} />} label="Total de Solicitações" value={data.totalRequests} />
          <KpiCard icon={<FolderOpen size={18} />} label="Serviços Disponíveis" value={data.totalServices} />
          <KpiCard icon={<Users size={18} />} label="Usuários Atendidos" value={data.totalUsers} />
          <KpiCard
            icon={<Clock size={18} />}
            label="Status Mais Frequente"
            value={topStatus ? STATUS_LABELS[topStatus.status] || topStatus.status : "—"}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Status</h2>
          {sortedStatus.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum status disponível no momento.</p>
          ) : (
            <div className="space-y-3">
              {sortedStatus.map((item) => {
                const pct = data.totalRequests > 0 ? (item.count / data.totalRequests) * 100 : 0;
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <div className="w-36 text-sm text-gray-600 truncate">
                      {STATUS_LABELS[item.status] || item.status}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 text-sm text-blue-800">
          <p className="font-semibold mb-1">Sobre estes dados</p>
          <p className="text-blue-600">
            Esta visão pública usa apenas o contrato oficial exposto em `GET /api/v1/public/stats`.
            Se o backend passar a expor séries temporais, bairros ou secretarias, a tela pode voltar a
            mostrar gráficos mais detalhados sem depender de suposições no frontend.
          </p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
