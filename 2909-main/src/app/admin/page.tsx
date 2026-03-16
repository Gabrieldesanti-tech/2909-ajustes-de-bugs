"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Timer,
  BarChart3,
} from "lucide-react";
import type { DashboardStats, RequestsByStatusChart } from "@/types";

// =============================================================================
// Dashboard Administrativo Principal
// =============================================================================
// Objetivo: Visão geral do sistema para gestores com:
// - KPIs em tempo real
// - Gráficos de volume e status
// - Alertas de SLA
// - Acesso rápido a ações comuns
// =============================================================================

interface DashboardData {
  stats: DashboardStats;
  charts: {
    byStatus: RequestsByStatusChart[];
    byPeriod: { date: string; count: number }[];
    byCategory: { category: string; service: string; count: number }[];
    byNeighborhood: { neighborhood: string; count: number }[];
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/v1/admin/dashboard");
      if (res.status === 403 || res.status === 401) {
        window.location.href = "/auth?redirect=/admin";
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback para quando não há dados (banco vazio)
  const stats: DashboardStats = data?.stats || {
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    resolvedRequests: 0,
    closedRequests: 0,
    cancelledRequests: 0,
    slaBreached: 0,
    avgResolutionHours: 0,
    todayRequests: 0,
    weekRequests: 0,
    monthRequests: 0,
  };

  const charts = data?.charts;

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visão geral do sistema - Atualizado em {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Solicitações"
          value={stats.totalRequests}
          icon={<FileText size={24} />}
          color="blue"
          subtitle={`${stats.monthRequests} este mês`}
        />
        <StatCard
          title="Aguardando Análise"
          value={stats.pendingRequests}
          icon={<Clock size={24} />}
          color="yellow"
          subtitle="Necessitam atenção"
        />
        <StatCard
          title="Em Andamento"
          value={stats.inProgressRequests}
          icon={<TrendingUp size={24} />}
          color="blue"
          subtitle="Sendo tratadas"
        />
        <StatCard
          title="Resolvidas"
          value={stats.resolvedRequests}
          icon={<CheckCircle size={24} />}
          color="green"
          subtitle={`${stats.closedRequests} encerradas`}
        />
      </div>

      {/* KPIs secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="SLA Expirado"
          value={stats.slaBreached}
          icon={<AlertTriangle size={24} />}
          color="red"
          subtitle="Prazo ultrapassado"
        />
        <StatCard
          title="Tempo Médio Resolução"
          value={`${stats.avgResolutionHours}h`}
          icon={<Timer size={24} />}
          color="purple"
          subtitle="Em horas"
        />
        <StatCard
          title="Hoje"
          value={stats.todayRequests}
          icon={<BarChart3 size={24} />}
          color="teal"
          subtitle="Novas solicitações"
        />
        <StatCard
          title="Esta Semana"
          value={stats.weekRequests}
          icon={<Users size={24} />}
          color="indigo"
          subtitle="Últimos 7 dias"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Distribuição por Status
          </h3>
          {charts?.byStatus && charts.byStatus.length > 0 ? (
            <div className="space-y-3">
              {charts.byStatus.map((item) => {
                const total = charts.byStatus.reduce((s, i) => s + i.count, 0);
                const pct = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600 truncate">
                      {item.statusLabel}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          backgroundColor: item.color,
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="Nenhuma solicitação registrada" />
          )}
        </div>

        {/* Top Serviços */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Serviços Mais Solicitados
          </h3>
          {charts?.byCategory && charts.byCategory.length > 0 ? (
            <div className="space-y-3">
              {charts.byCategory.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.service}
                    </p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhuma solicitação registrada" />
          )}
        </div>

        {/* Volume por Período (últimos 30 dias) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Volume nos Últimos 30 Dias
          </h3>
          {charts?.byPeriod && charts.byPeriod.length > 0 ? (
            <div className="flex items-end gap-1 h-48">
              {charts.byPeriod.map((item) => {
                const maxCount = Math.max(...charts.byPeriod.map(i => i.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div
                    key={item.date}
                    className="flex-1 group relative"
                  >
                    <div
                      className="bg-blue-500 hover:bg-blue-600 rounded-t transition-all duration-200 cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}: {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="Nenhum dado no período" />
          )}
        </div>

        {/* Top Bairros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Solicitações por Bairro
          </h3>
          {charts?.byNeighborhood && charts.byNeighborhood.length > 0 ? (
            <div className="space-y-3">
              {charts.byNeighborhood.slice(0, 10).map((item, index) => {
                const maxCount = charts.byNeighborhood[0].count;
                const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-36 truncate">
                      {item.neighborhood}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-10 text-right">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="Nenhum dado de localização" />
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-700", iconBg: "bg-green-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", iconBg: "bg-yellow-100" },
    red: { bg: "bg-red-50", text: "text-red-700", iconBg: "bg-red-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", iconBg: "bg-purple-100" },
    teal: { bg: "bg-teal-50", text: "text-teal-700", iconBg: "bg-teal-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", iconBg: "bg-indigo-100" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg} ${c.text}`}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
      <BarChart3 size={32} className="mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
