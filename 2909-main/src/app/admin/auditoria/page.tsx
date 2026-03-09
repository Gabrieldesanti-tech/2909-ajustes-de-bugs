"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, RefreshCw } from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Criação",
  READ: "Leitura",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
  EXPORT: "Exportação",
  STATUS_CHANGE: "Mudança de Status",
  ASSIGNMENT: "Atribuição",
  COMMENT: "Comentário",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  LOGIN: "bg-blue-100 text-blue-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  UPDATE: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
  STATUS_CHANGE: "bg-purple-100 text-purple-700",
  EXPORT: "bg-cyan-100 text-cyan-700",
  COMMENT: "bg-indigo-100 text-indigo-700",
};

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      params.set("page", page.toString());
      params.set("limit", "50");
      const res = await fetch(`/api/v1/admin/auditoria?${params}`);
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/auditoria"; return; }
      const json = await res.json();
      if (json.success) { setLogs(json.data || []); setTotal(json.total || 0); }
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, [actionFilter, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Auditoria</h1>
          <p className="text-sm text-gray-500 mt-1">{total} registro{total !== 1 ? "s" : ""} de auditoria</p>
        </div>
        <button onClick={fetchLogs} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3">
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none">
            <option value="">Todas as ações</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Shield size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum registro de auditoria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Usuário</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Ação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Entidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">{log.user?.name || "Sistema"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"}`}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{log.entity}{log.entityId ? ` #${log.entityId.slice(-6)}` : ""}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs font-mono">{log.ipAddress || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
