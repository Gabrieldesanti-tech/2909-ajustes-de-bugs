"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import {
  BarChart3, Activity, CheckCircle, Clock, AlertTriangle, Target,
  Users, RefreshCw, TrendingUp, Building2, Zap, XCircle,
} from "lucide-react";

interface KPIs {
  totalRequests: number;
  resolvedCount: number;
  pendingCount: number;
  inProgressCount: number;
  slaBreachedCount: number;
  slaRate: number;
  avgHours: number;
  totalUsers: number;
  totalServices: number;
}

interface Charts {
  byStatus: { name: string; value: number; color: string }[];
  byDepartment: { name: string; fullName: string; count: number }[];
  byPeriod: { date: string; count: number }[];
  byNeighborhood: { name: string; count: number }[];
  byService: { name: string; count: number }[];
}

const DEPT_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308", "#ef4444"];

export default function RelatoriosPublicosPage() {
  const [data, setData] = useState<{ kpis: KPIs; charts: Charts } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/public/stats");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><RefreshCw size={32} className="animate-spin mx-auto mb-3 text-blue-600" /><p className="text-gray-500">Carregando dados...</p></div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-500">Erro ao carregar dados</div>;

  const { kpis, charts } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div style={{ backgroundColor: "#1748ae" }} className="text-white py-12 md:py-16">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl"><BarChart3 size={32} /></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Relatórios e Indicadores</h1>
              <p className="text-blue-200 text-sm mt-1">Portal 2909 · Prefeitura de Belford Roxo</p>
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mt-4">
            Acompanhe em tempo real os indicadores de atendimento ao cidadão,
            desempenho das secretarias e cumprimento de prazos (SLA).
          </p>
        </div>
      </div>

      <div className="container-main py-10 space-y-6">
        {/* Atualização */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Dados atualizados em {new Date().toLocaleString("pt-BR")}</p>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800">
            <RefreshCw size={14} />Atualizar
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon={<Activity size={18} />} label="Total Solicitações" value={kpis.totalRequests} color="blue" />
          <KpiCard icon={<Clock size={18} />} label="Aguardando" value={kpis.pendingCount} color="yellow" />
          <KpiCard icon={<Zap size={18} />} label="Em Andamento" value={kpis.inProgressCount} color="blue" />
          <KpiCard icon={<CheckCircle size={18} />} label="Resolvidas" value={kpis.resolvedCount} color="green" />
          <KpiCard icon={<Target size={18} />} label="SLA Cumprido" value={`${kpis.slaRate}%`} color="emerald" />
          <KpiCard icon={<AlertTriangle size={18} />} label="SLA Expirado" value={kpis.slaBreachedCount} color="red" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniKpi label="Tempo Médio Resolução" value={kpis.avgHours > 0 ? `${kpis.avgHours}h` : "—"} icon={<TrendingUp size={16} />} />
          <MiniKpi label="Cidadãos Cadastrados" value={kpis.totalUsers} icon={<Users size={16} />} />
          <MiniKpi label="Serviços Disponíveis" value={kpis.totalServices} icon={<Building2 size={16} />} />
          <MiniKpi label="Taxa de Resolução" value={kpis.totalRequests > 0 ? `${Math.round((kpis.resolvedCount / kpis.totalRequests) * 100)}%` : "—"} icon={<CheckCircle size={16} />} />
        </div>

        {/* Row 1: Status + Secretarias */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <ChartCard title="Distribuição por Status" className="lg:col-span-2">
            {charts.byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={charts.byStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                    paddingAngle={3} dataKey="value" nameKey="name"
                    label={({ name, percent }: { name?: string | number; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false} style={{ fontSize: 11 }}>
                    {charts.byStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Solicitações"]} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>

          <ChartCard title="Solicitações por Secretaria" className="lg:col-span-3">
            {charts.byDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.byDepartment} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => [v, "Solicitações"]}
                    labelFormatter={l => charts.byDepartment.find(d => d.name === l)?.fullName || String(l)} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>
        </div>

        {/* Row 2: Evolução temporal */}
        <ChartCard title="Evolução de Solicitações ao Longo do Tempo">
          {charts.byPeriod.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={charts.byPeriod} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => { const p = d.split("-"); return `${p[2]}/${p[1]}`; }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip labelFormatter={d => { const p = String(d).split("-"); return `${p[2]}/${p[1]}/${p[0]}`; }}
                  formatter={(v) => [v, "Solicitações"]} />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#pubGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        {/* Row 3: Serviços + Bairros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Serviços Mais Solicitados">
            {charts.byService.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(200, charts.byService.length * 36)}>
                <BarChart data={charts.byService} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip formatter={(v) => [v, "Solicitações"]} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>

          <ChartCard title="Solicitações por Bairro">
            {charts.byNeighborhood.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(200, charts.byNeighborhood.length * 32)}>
                <BarChart data={charts.byNeighborhood} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip formatter={(v) => [v, "Solicitações"]} />
                  <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </ChartCard>
        </div>

        {/* Nota */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 text-sm text-blue-800">
          <p className="font-semibold mb-1">Sobre estes dados</p>
          <p className="text-blue-600">
            Os dados apresentados são públicos e atualizados em tempo real com base nas solicitações
            registradas no Portal 2909 de Atendimento ao Cidadão da Prefeitura de Belford Roxo.
            Para informações detalhadas ou dados específicos, utilize a Lei de Acesso à Informação (LAI).
          </p>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-gray-400 pt-4">
          Portal 2909 · Prefeitura Municipal de Belford Roxo · Dados abertos para o cidadão
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colors: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", text: "text-yellow-700" },
    green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", text: "text-emerald-700" },
    red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`${c.bg} rounded-xl p-4 border border-gray-100`}>
      <div className={`${c.icon} mb-2`}>{icon}</div>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function MiniKpi({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
      <div><p className="text-lg font-bold text-gray-800">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[200px] text-gray-300">
      <div className="text-center"><BarChart3 size={32} className="mx-auto mb-2 opacity-50" /><p className="text-xs">Sem dados para exibir</p></div>
    </div>
  );
}
