"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Building2,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Solicitações",
    href: "/admin/solicitacoes",
    icon: FileText,
  },
  {
    label: "Serviços",
    href: "/admin/servicos",
    icon: FolderOpen,
  },
  {
    label: "Usuários",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    label: "Secretarias",
    href: "/admin/secretarias",
    icon: Building2,
  },
  {
    label: "Relatórios",
    href: "/admin/relatorios",
    icon: BarChart3,
  },
  {
    label: "Notificações",
    href: "/admin/notificacoes",
    icon: Bell,
  },
  {
    label: "Auditoria",
    href: "/admin/auditoria",
    icon: Shield,
  },
  {
    label: "FAQ",
    href: "/admin/faq",
    icon: HelpCircle,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-[#1e293b] text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              29
            </div>
            <span className="font-bold text-lg">Admin 2909</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Voltar ao Portal Público
          </Link>
        </div>
      )}
    </aside>
  );
}
