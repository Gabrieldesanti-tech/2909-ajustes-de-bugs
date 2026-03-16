"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, LogOut, User, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/v1/admin/notificacoes?countOnly=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success) setUnreadCount(json.unread || 0);
        }
      } catch {
        // silenciar erro
      }
    };

    fetchCount();
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      window.location.href = "/auth";
    } catch {
      window.location.href = "/auth";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Breadcrumb / Título */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Painel Administrativo
        </h2>
        <p className="text-xs text-gray-500">Portal 2909 - Belford Roxo</p>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <Link
          href="/admin/notificacoes"
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Notificações"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              Administrador
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
