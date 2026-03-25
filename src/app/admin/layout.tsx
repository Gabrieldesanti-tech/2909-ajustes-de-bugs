// =============================================================================
// Layout do Painel Administrativo
// =============================================================================
// Design: Sidebar fixa com navegação, área principal adaptável.
// Decisão técnica: Layout separado do público para não carregar
// componentes administrativos na área do cidadão (code splitting).
// =============================================================================

import type { Metadata } from "next";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuard from "@/components/admin/AdminGuard";

export const metadata: Metadata = {
  title: {
    default: "Admin - Portal 2909",
    template: "%s | Admin Portal 2909",
  },
  description: "Painel administrativo do Portal 2909",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div
        className="flex h-screen overflow-hidden bg-gray-50"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        {/* Sidebar */}
        <AdminSidebar />

        {/* Área principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
