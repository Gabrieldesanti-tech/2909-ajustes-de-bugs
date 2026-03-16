"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Building2, Mail, RefreshCw, Search, FolderOpen, ChevronRight } from "lucide-react";

interface Secretaria {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  isActive: boolean;
  _count: { requests: number; categories: number };
}

export default function SecretariasPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSecretarias = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/secretarias");
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/secretarias"; return; }
      const json = await res.json();
      if (json.success) setSecretarias(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSecretarias(); }, [fetchSecretarias]);

  const filtered = secretarias.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalRequests = secretarias.reduce((s, sec) => s + sec._count.requests, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Secretarias Municipais</h1>
          <p className="text-sm text-gray-500 mt-1">{secretarias.length} secretarias · {totalRequests} solicitações vinculadas</p>
        </div>
        <button onClick={fetchSecretarias} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar secretaria por nome ou sigla..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(sec => {
            const parts = sec.name.split(" - ");
            const nome = parts[0];
            const sigla = parts[1] || sec.slug.toUpperCase();
            return (
              <Link key={sec.id} href={`/admin/secretarias/${sec.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all block group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-blue-700 transition-colors">{nome}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded shrink-0">{sigla}</span>
                    </div>
                    {sec.email && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Mail size={12} />{sec.email}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <FolderOpen size={14} className="text-gray-400" />
                        {sec._count.categories} categoria{sec._count.categories !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-gray-600">
                        {sec._count.requests} solicitaç{sec._count.requests !== 1 ? "ões" : "ão"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 mt-3 transition-colors shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
