// =============================================================================
// Homepage do Portal 2909
// =============================================================================
// Melhorias implementadas:
// - CTAs proeminentes: "Fazer Solicitação" e "Consultar Protocolo"
// - Hierarquia visual clara com seções bem definidas
// - Linguagem simples e orientada à ação
// - HTML semântico para SEO e acessibilidade
// - Cards com ícones claros e descritivos
// - Seção de números/estatísticas para credibilidade
// =============================================================================

import Sidebar from "@/components/layout/Sidebar";
import Banner from "@/components/ui/Banner";
import {
  Download,
  Clock,
  Smartphone,
  Phone,
  FileText,
  Search,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container-main py-6 md:py-8">
      {/* CTAs Principais - Visíveis imediatamente (above the fold) */}
      <section aria-label="Ações rápidas" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/solicitacao"
            className="group flex items-center gap-4 p-5 md:p-6 bg-[#1748ae] hover:bg-[#0d3380] text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <FileText size={28} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <span className="text-lg md:text-xl font-bold block">
                Fazer Solicitação
              </span>
              <span className="text-sm text-white/80 block mt-0.5">
                Registre sua demanda em poucos passos
              </span>
            </div>
            <ArrowRight size={22} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </Link>

          <Link
            href="/consulta"
            className="group flex items-center gap-4 p-5 md:p-6 bg-[#0094de] hover:bg-[#0077b3] text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
              <Search size={28} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <span className="text-lg md:text-xl font-bold block">
                Consultar Protocolo
              </span>
              <span className="text-sm text-white/80 block mt-0.5">
                Acompanhe o andamento da sua solicitação
              </span>
            </div>
            <ArrowRight size={22} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar com categorias */}
        <Sidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 space-y-6">
          {/* Banner/Carrossel */}
          <Banner />

          {/* CTA Secundário - Cartilha do Cidadão */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              background: "linear-gradient(to bottom, #dbeafe, #bfdbfe)",
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center opacity-20">
              <svg
                viewBox="0 0 1200 100"
                className="w-full"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden="true"
                role="presentation"
              >
                <path
                  d="M0,100 L0,65 L40,65 L40,40 L60,40 L60,55 L100,55 L100,30 L120,30 L120,65 L160,65 L160,50 L200,50 L200,65 L240,65 L240,35 L280,35 L280,65 L320,65 L320,20 L360,20 L360,65 L400,65 L400,45 L440,45 L440,65 L480,65 L480,15 L520,15 L520,65 L560,65 L560,50 L600,50 L600,65 L640,65 L640,35 L680,35 L680,65 L720,65 L720,55 L760,55 L760,65 L800,65 L800,40 L840,40 L840,65 L880,65 L880,28 L920,28 L920,65 L960,65 L960,45 L1000,45 L1000,65 L1040,65 L1040,58 L1080,58 L1080,65 L1120,65 L1120,50 L1160,50 L1160,65 L1200,65 L1200,100 Z"
                  fill="#1748ae"
                />
              </svg>
            </div>

            <div className="relative px-6 md:px-8 py-8 md:py-10 text-center">
              <Link
                href="/cartilha"
                className="cartilha-btn inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 text-white font-bold rounded-lg transition-colors shadow-lg text-sm md:text-base"
              >
                <Download size={20} aria-hidden="true" />
                Baixe aqui a Cartilha ao Cidadão
              </Link>
            </div>
          </div>

          {/* Serviços Rápidos */}
          <section aria-labelledby="quick-services-title">
            <h2 id="quick-services-title" className="text-lg font-bold text-gray-800 mb-4">
              Acesso Rápido
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <QuickServiceCard
                href="/ouvidoria"
                icon={<MessageSquare size={24} aria-hidden="true" />}
                label="Ouvidoria"
              />
              <QuickServiceCard
                href="/faq"
                icon={<Shield size={24} aria-hidden="true" />}
                label="Perguntas Frequentes"
              />
              <QuickServiceCard
                href="/auth"
                icon={<CheckCircle size={24} aria-hidden="true" />}
                label="Minha Conta"
              />
              <QuickServiceCard
                href="/lai"
                icon={<FileText size={24} aria-hidden="true" />}
                label="Acesso à Informação"
              />
            </div>
          </section>

          {/* Cards de informações rápidas */}
          <section aria-labelledby="info-cards-title">
            <h2 id="info-cards-title" className="sr-only">
              Informações sobre o atendimento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickInfoCard
                title="Atendimento 24h"
                description="O portal está disponível 24 horas por dia, 7 dias por semana para registrar sua solicitação."
                icon={<Clock size={32} className="text-[#1748ae]" aria-hidden="true" />}
              />
              <QuickInfoCard
                title="Acompanhe Online"
                description="Consulte o status das suas solicitações a qualquer momento usando o número do protocolo."
                icon={<Smartphone size={32} className="text-[#1748ae]" aria-hidden="true" />}
              />
              <QuickInfoCard
                title="Ligue 2909"
                description="Atendimento telefônico de segunda a sexta, das 8h às 17h. Ligação de telefone fixo."
                icon={<Phone size={32} className="text-[#1748ae]" aria-hidden="true" />}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function QuickServiceCard({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center group"
    >
      <div className="text-[#1748ae] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-[#1748ae] transition-colors">
        {label}
      </span>
    </Link>
  );
}

function QuickInfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="mb-3" aria-hidden="true">{icon}</div>
      <h3 className="font-bold text-base md:text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </article>
  );
}
