"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderOpen, ChevronDown, ChevronRight, Clock, RefreshCw, Search } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  slaHours: number;
  slaPriority: string;
  isActive: boolean;
  _count?: { requests: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  isActive: boolean;
  department: { name: string } | null;
  services: Service[];
}

const PRIORITY_LABELS: Record<string, string> = {
  URGENT: "Urgente",
  HIGH: "Alta",
  NORMAL: "Normal",
  LOW: "Baixa",
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  NORMAL: "bg-blue-100 text-blue-700",
  LOW: "bg-gray-100 text-gray-700",
};

export default function ServicosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/services");
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/servicos"; return; }
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.services.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalServices = categories.reduce((s, c) => s + c.services.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Serviços</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categorias, {totalServices} serviços cadastrados</p>
        </div>
        <button onClick={fetchServices} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar categoria ou serviço..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FolderOpen size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500">
                      {cat.services.length} serviço{cat.services.length !== 1 ? "s" : ""}
                      {cat.department && <> · <span className="text-blue-600">{cat.department.name.split(" - ")[1] || cat.department.name}</span></>}
                    </p>
                  </div>
                </div>
                {expandedCats.has(cat.id) ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
              </button>

              {expandedCats.has(cat.id) && (
                <div className="border-t border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-2.5 px-5 font-medium text-gray-600">Serviço</th>
                        <th className="text-left py-2.5 px-4 font-medium text-gray-600">Prioridade</th>
                        <th className="text-left py-2.5 px-4 font-medium text-gray-600">Prazo SLA</th>
                        <th className="text-center py-2.5 px-4 font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {cat.services.map(svc => (
                        <tr key={svc.id} className="hover:bg-gray-50">
                          <td className="py-3 px-5">
                            <p className="font-medium text-gray-800">{svc.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-sm">{svc.description}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[svc.slaPriority] || "bg-gray-100"}`}>
                              {PRIORITY_LABELS[svc.slaPriority] || svc.slaPriority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                              <Clock size={14} />
                              {svc.slaHours <= 24 ? `${svc.slaHours}h` : `${Math.round(svc.slaHours / 24)} dias`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${svc.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {svc.isActive !== false ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
