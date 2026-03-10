import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, BookOpen, Users, Info, FileText, Scale } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { getServiceBySlug, getCategoryBySlug } from "@/data/services";
import { getServiceBySlugsFromDb } from "@/lib/services-db";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ category: string; service: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, service } = await params;
  const fromDb = await getServiceBySlugsFromDb(category, service);
  const serviceData = fromDb ?? getServiceBySlug(category, service);

  if (!serviceData) {
    return { title: "Serviço não encontrado" };
  }

  return {
    title: serviceData.name,
    description: serviceData.description,
  };
}

type DetailedInfo = {
  oQueE?: string;
  paraQueServe?: string;
  quemPodeSolicitar?: string;
  informacoesComplementares?: string;
  informacoesNecessarias?: string[];
  tempoAtendimento?: string;
  legislacao?: string[];
};

export default async function ServicePage({ params }: PageProps) {
  const { category, service } = await params;
  const fromDb = await getServiceBySlugsFromDb(category, service);
  const serviceData = fromDb ?? getServiceBySlug(category, service);
  const categoryData = fromDb?.category ? { name: fromDb.category.name, slug: fromDb.category.slug } : getCategoryBySlug(category);

  if (!categoryData || !serviceData) {
    notFound();
  }

  const detailedInfo = (serviceData.detailedInfo ?? (serviceData as { detailedInfo?: DetailedInfo }).detailedInfo) as DetailedInfo | undefined;

  return (
    <div className="container-main py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar activeCategory={category} />

        {/* Conteúdo principal */}
        <div className="flex-1">
          {/* Breadcrumb */}
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
                <Link
                  href={`/servicos/${category}`}
                  className="hover:text-primary transition-colors"
                >
                  {categoryData.name}
                </Link>
              </li>
              <ChevronRight size={14} />
              <li className="text-primary font-medium">{serviceData.name}</li>
            </ol>
          </nav>

          {/* Detalhes do serviço */}
          <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 bg-linear-to-r from-primary/5 to-transparent">
              <h1 className="text-2xl font-bold text-neutral-800">
                {serviceData.name}
              </h1>
            </div>

            <div className="px-6 py-6">
              {detailedInfo ? (
                <div className="space-y-6">
                  {/* O que é */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Info size={20} />
                      <h2 className="font-bold text-lg">O que é:</h2>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pl-7">
                      {detailedInfo.oQueE}
                    </p>
                  </div>

                  {/* Para que serve */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <BookOpen size={20} />
                      <h2 className="font-bold text-lg">Para que serve:</h2>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pl-7">
                      {detailedInfo.paraQueServe}
                    </p>
                  </div>

                  {/* Quem pode solicitar */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Users size={20} />
                      <h2 className="font-bold text-lg">Quem pode solicitar:</h2>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pl-7">
                      {detailedInfo.quemPodeSolicitar}
                    </p>
                  </div>

                  {/* Informações complementares */}
                  {detailedInfo.informacoesComplementares && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Info size={20} />
                        <h2 className="font-bold text-lg">Informações complementares:</h2>
                      </div>
                      <p className="text-neutral-700 leading-relaxed pl-7">
                        {detailedInfo.informacoesComplementares}
                      </p>
                    </div>
                  )}

                  {/* Informações necessárias */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <FileText size={20} />
                      <h2 className="font-bold text-lg">Informações necessárias:</h2>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-7">
                      {detailedInfo.informacoesNecessarias?.map((info, index) => (
                        <li key={index}>{info}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tempo para atendimento */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock size={20} />
                      <h2 className="font-bold text-lg">Tempo para atendimento:</h2>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pl-7 font-medium">
                      {detailedInfo.tempoAtendimento}
                    </p>
                  </div>

                  {/* Legislação relacionada */}
                  {detailedInfo.legislacao && detailedInfo.legislacao.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Scale size={20} />
                        <h2 className="font-bold text-lg">Legislação relacionada:</h2>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-neutral-700 pl-7">
                        {detailedInfo.legislacao.map((lei, index) => (
                          <li key={index}>{lei}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback para serviços sem informações detalhadas */
                <div className="space-y-4 mb-8">
                  <h2 className="font-semibold text-lg text-neutral-800">
                    Informações sobre este serviço
                  </h2>
                  <div className="prose prose-sm max-w-none text-neutral-600">
                    <p>{serviceData.description}</p>
                  </div>
                </div>
              )}

              {/* Slogan antes dos botões */}
              <p className="mt-6 mb-2 text-base font-semibold text-primary bg-primary/5 border border-primary/10 rounded-md px-4 py-3">
                Para mais informações e atendimento digital, utilize nossos canais oficiais abaixo.
              </p>

              {/* Botões de ação */}
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
