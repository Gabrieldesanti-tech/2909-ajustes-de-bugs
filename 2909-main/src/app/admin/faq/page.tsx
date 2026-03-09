"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
  isActive: boolean;
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/faq");
      if (res.status === 403) { window.location.href = "/auth?redirect=/admin/faq"; return; }
      const json = await res.json();
      if (json.success) setFaqs(json.data || []);
    } catch (e) { console.error("Erro:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const toggle = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perguntas Frequentes</h1>
          <p className="text-sm text-gray-500 mt-1">{faqs.length} pergunta{faqs.length !== 1 ? "s" : ""} cadastrada{faqs.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={fetchFaqs} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><RefreshCw size={18} /></button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Carregando...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <HelpCircle size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma FAQ cadastrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={faq.id}>
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">{i + 1}</span>
                  <span className="flex-1 font-medium text-gray-800 text-sm">{faq.question}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${faq.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {faq.isActive ? "Ativa" : "Inativa"}
                  </span>
                  {expanded.has(faq.id) ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                </button>
                {expanded.has(faq.id) && (
                  <div className="px-5 pb-4 pl-16">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    <p className="text-xs text-gray-400 mt-2">Categoria: {faq.categoryId} · Ordem: {faq.order}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
