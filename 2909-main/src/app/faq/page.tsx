"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Search, HelpCircle } from "lucide-react";
import { faqData } from "@/data/services";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQ = searchQuery
    ? faqData.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData;

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-neutral-500">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Portal 2909
              </Link>
            </li>
            <ChevronRight size={14} />
            <li className="text-primary font-medium">Perguntas Frequentes</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Perguntas Frequentes
          </h1>
          <p className="text-neutral-600">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>

        {/* Busca */}
        <div className="mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Lista de perguntas */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
          {filteredFAQ.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {filteredFAQ.map((item) => (
                <div key={item.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-medium text-neutral-800 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-neutral-400 flex-shrink-0 transition-transform ${
                        openItems.includes(item.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4 text-neutral-600 animate-slide-down">
                      <p className="border-l-2 border-primary pl-4">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-neutral-500">
              <p>Nenhuma pergunta encontrada para &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-neutral-700 mb-4">
            Não encontrou o que procurava?
          </p>
          <Link
            href="/ouvidoria"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Fale com a Ouvidoria
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
