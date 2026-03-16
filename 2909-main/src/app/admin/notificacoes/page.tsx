"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, RefreshCw, AlertTriangle, MessageSquare, Clock, Info, ExternalLink, CheckCheck, Check } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  STATUS_UPDATE: <Clock size={16} className="text-blue-500" />,
  NEW_COMMENT: <MessageSquare size={16} className="text-green-500" />,
  SLA_WARNING: <AlertTriangle size={16} className="text-amber-500" />,
  SLA_BREACH: <AlertTriangle size={16} className="text-red-500" />,
  SYSTEM: <Info size={16} className="text-gray-500" />,
};

const TYPE_LABELS: Record<string, string> = {
  STATUS_UPDATE: "Atualização de Status",
  NEW_COMMENT: "Novo Comentário",
  SLA_WARNING: "Alerta de SLA",
  SLA_BREACH: "SLA Expirado",
  SYSTEM: "Sistema",
};

const TYPE_BG: Record<string, string> = {
  STATUS_UPDATE: "border-l-blue-400",
  NEW_COMMENT: "border-l-green-400",
  SLA_WARNING: "border-l-amber-400",
  SLA_BREACH: "border-l-red-400",
  SYSTEM: "border-l-gray-400",
};

export default function NotificacoesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/notificacoes");
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/notificacoes"; return; }
      const json = await res.json();
      if (json.success) setNotifications(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Marcar uma notificação como lida e navegar
  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      // Marcar como lida no backend
      try {
        await fetch("/api/v1/admin/notificacoes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id }),
        });
      } catch (e) { console.error("Erro ao marcar como lida:", e); }

      // Atualizar estado local imediatamente
      setNotifications(prev => prev.map(notif =>
        notif.id === n.id ? { ...notif, isRead: true } : notif
      ));
    }

    // Navegar se tiver link
    if (n.link) {
      router.push(n.link);
    }
  };

  // Marcar todas como lidas
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/v1/admin/notificacoes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (e) { console.error("Erro:", e); }
  };

  const filtered = typeFilter
    ? notifications.filter(n => n.type === typeFilter)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return "Agora mesmo";
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffH < 24) return `${diffH}h atrás`;
    if (diffD < 7) return `${diffD}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
          <p className="text-sm text-gray-500 mt-1">
            {notifications.length} notificaç{notifications.length !== 1 ? "ões" : "ão"}
            {unreadCount > 0 && <span className="text-blue-600 font-medium"> · {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <CheckCheck size={14} />
              Marcar todas como lidas
            </button>
          )}
          <button onClick={fetchNotifications} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTypeFilter("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!typeFilter ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          Todas ({notifications.length})
        </button>
        {Object.entries(TYPE_LABELS).map(([key, label]) => {
          const count = notifications.filter(n => n.type === key).length;
          if (count === 0) return null;
          return (
            <button key={key} onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            {notifications.length === 0 ? (
              <>
                <CheckCheck size={48} className="mx-auto mb-4 opacity-40" />
                <p className="font-medium text-gray-500">Tudo em dia!</p>
                <p className="text-sm mt-1">Não há notificações pendentes no momento.</p>
              </>
            ) : (
              <>
                <Bell size={48} className="mx-auto mb-4 opacity-40" />
                <p className="font-medium text-gray-500">Nenhuma notificação deste tipo</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(n => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-l-4 ${TYPE_BG[n.type] || "border-l-gray-300"} ${!n.isRead ? "bg-blue-50/30" : ""}`}
              >
                <div className="mt-0.5 shrink-0">{TYPE_ICONS[n.type] || TYPE_ICONS.SYSTEM}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">{TYPE_LABELS[n.type] || n.type}</span>
                    {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                  </div>
                  <p className={`text-sm mt-0.5 ${!n.isRead ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(n.createdAt)}</span>
                  {n.link && <ExternalLink size={14} className="text-gray-300" />}
                  {!n.isRead && !n.link && (
                    <span title="Marcar como lida"><Check size={14} className="text-gray-300 hover:text-blue-500" /></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
