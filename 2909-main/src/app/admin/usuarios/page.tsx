"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Shield, UserCheck, UserX } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count?: { requests: number };
}

const ROLE_LABELS: Record<string, string> = {
  CITIZEN: "Cidadão",
  ATTENDANT: "Atendente",
  ANALYST: "Analista",
  MANAGER: "Gestor",
  ADMIN: "Administrador",
};

const ROLE_COLORS: Record<string, string> = {
  CITIZEN: "bg-gray-100 text-gray-700",
  ATTENDANT: "bg-blue-100 text-blue-700",
  ANALYST: "bg-purple-100 text-purple-700",
  MANAGER: "bg-amber-100 text-amber-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/v1/admin/users?${params}`);
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/usuarios"; return; }
      const json = await res.json();
      if (json.success) setUsers(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchUsers(); };

  const formatCPF = (cpf: string) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} usuário{users.length !== 1 ? "s" : ""} encontrado{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetchUsers} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none">
            <option value="">Todos os perfis</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">E-mail</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">CPF</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Perfil</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{formatCPF(user.cpf)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || "bg-gray-100"}`}>
                        <Shield size={12} />
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs"><UserCheck size={14} />Ativo</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs"><UserX size={14} />Inativo</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
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
