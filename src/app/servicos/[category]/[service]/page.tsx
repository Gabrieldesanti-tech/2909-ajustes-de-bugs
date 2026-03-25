"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, ChevronRight, Clock, FileText, Info, Loader2, Scale, Users } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { apiGet } from "@/lib/api";
import type { ApiEnvelope, CatalogServiceDetail, DetailedServiceInfo } from "@/types";

export default function ServicePage() {
  const params = useParams<{ category: string; service: string }>();
  const category = params.category;
  const service = params.service;
  const [serviceData, setServiceData] = useState<CatalogServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const payload = await apiGet<ApiEnvelope<CatalogServiceDetail>>(
          `/api/v1/catalog/services/${category}/${service}`
        );
        const data = payload.data;
        if (!active) return;
        setServiceData(data || null);
      } catch {
        if (!active) return;
        setMissing(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [category, service]);

  if (missing) {
    return (
      <div className="container-main py-12 text-center text-neutral-500">
        <p>Serviço não encontrado.</p>
      </div>
    );
  }

  const parsedDetailedInfo = serviceData?.detailedInfo as DetailedServiceInfo | undefined;

  const categoryData = serviceData?.category;

  return (
    <div className="container-main py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar activeCategory={category} />

        <div className="flex-1">
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-neutral-500 flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Portal 2909
                </Link>
              </li>
              <ChevronRight size={14} />
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <ChevronRight size={14} />
              <li>
                <Link href={`/servicos/${category}`} className="hover:text-primary transition-colors">
                  {categoryData?.name || category}
                </Link>
              </li>
              <ChevronRight size={14} />
              <li className="text-primary font-medium">
                {serviceData?.name || "Carregando..."}
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 bg-linear-to-r from-primary/5 to-transparent">
              <h1 className="text-2xl font-bold text-neutral-800">
                {serviceData?.name || "Carregando serviço"}
              </h1>
            </div>

            <div className="px-6 py-6">
              {loading ? (
                <div className="py-12 text-center text-neutral-500">
                  <Loader2 size={24} className="animate-spin mx-auto mb-3 text-[#1748ae]" />
                  <p>Carregando detalhes do serviço...</p>
                </div>
              ) : parsedDetailedInfo ? (
                <div className="space-y-6">
                  <InfoSection icon={<Info size={20} />} title="O que é:" value={parsedDetailedInfo.oQueE} />
                  <InfoSection icon={<BookOpen size={20} />} title="Para que serve:" value={parsedDetailedInfo.paraQueServe} />
                  <InfoSection icon={<Users size={20} />} title="Quem pode solicitar:" value={parsedDetailedInfo.quemPodeSolicitar} />

                  {parsedDetailedInfo.informacoesComplementares && (
                    <InfoSection
                      icon={<Info size={20} />}
                      title="Informações complementares:"
                      value={parsedDetailedInfo.informacoesComplementares}
                    />
                  )}

                  <ListSection
                    icon={<FileText size={20} />}
                    title="Informações necessárias:"
                    items={parsedDetailedInfo.informacoesNecessarias}
                  />

                  <InfoSection
                    icon={<Clock size={20} />}
                    title="Tempo para atendimento:"
                    value={parsedDetailedInfo.tempoAtendimento}
                    emphasis
                  />

                  {parsedDetailedInfo.legislacao && parsedDetailedInfo.legislacao.length > 0 && (
                    <ListSection
                      icon={<Scale size={20} />}
                      title="Legislação relacionada:"
                      items={parsedDetailedInfo.legislacao}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <h2 className="font-semibold text-lg text-neutral-800">Informações sobre este serviço</h2>
                  <div className="prose prose-sm max-w-none text-neutral-600">
                    <p>{serviceData?.description}</p>
                  </div>
                </div>
              )}

              <p className="mt-6 mb-2 text-base font-semibold text-primary bg-primary/5 border border-primary/10 rounded-md px-4 py-3">
                Para mais informações e atendimento digital, utilize nossos canais oficiais abaixo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-6 border-t border-neutral-100">
                <Link
                  href="/phiz"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#0d3380] transition-colors shadow-md"
                >
                  Baixe o app PhizChat
                </Link>
                <Link
                  href={`/servicos/${category}`}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:border-neutral-400 transition-colors"
                >
                  Voltar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  value,
  emphasis = false,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
  emphasis?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <p className={`text-neutral-700 leading-relaxed pl-7 ${emphasis ? "font-medium" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function ListSection({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-7">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
