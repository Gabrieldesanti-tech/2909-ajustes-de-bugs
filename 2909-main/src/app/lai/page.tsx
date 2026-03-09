import {
  FileText, Scale, Clock, Users, Shield, BookOpen, ExternalLink,
  Download, Phone, Mail, MapPin, Building2,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Lei de Acesso à Informação - Portal 2909 Belford Roxo",
  description: "Acesse informações públicas da Prefeitura de Belford Roxo conforme a Lei Federal nº 12.527/2011.",
};

export default function LAIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div style={{ backgroundColor: "#1748ae" }} className="text-white py-12 md:py-16">
        <div className="container-main">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl"><Scale size={32} /></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Lei de Acesso à Informação</h1>
                <p className="text-blue-200 text-sm mt-1">Lei Federal nº 12.527/2011</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed mt-4">
              A Lei de Acesso à Informação (LAI) garante a todo cidadão o direito de receber
              dos órgãos públicos informações de seu interesse particular ou de interesse coletivo.
            </p>
          </div>
        </div>
      </div>

      <div className="container-main py-10 space-y-8">
        {/* O que é a LAI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={22} className="text-blue-600" />O que é a LAI?
          </h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              A <strong>Lei nº 12.527, de 18 de novembro de 2011</strong>, regulamenta o direito constitucional
              de acesso às informações públicas. Essa norma entrou em vigor em 16 de maio de 2012 e criou
              mecanismos que possibilitam a qualquer pessoa, física ou jurídica, sem necessidade de apresentar
              motivo, o recebimento de informações públicas dos órgãos e entidades.
            </p>
            <p>
              A LAI estabelece que a <strong>publicidade é a regra</strong> e o <strong>sigilo é a exceção</strong>.
              Assim, toda informação produzida ou custodiada pelo poder público é, em princípio, pública e
              acessível a todos os cidadãos.
            </p>
          </div>
        </div>

        {/* Cards de direitos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<Users size={24} />}
            title="Quem pode solicitar?"
            description="Qualquer pessoa, física ou jurídica, sem necessidade de apresentar motivo, pode solicitar informações aos órgãos públicos."
          />
          <InfoCard
            icon={<Clock size={24} />}
            title="Qual o prazo de resposta?"
            description="O órgão público deve responder imediatamente ou em até 20 dias, prorrogáveis por mais 10 dias mediante justificativa."
          />
          <InfoCard
            icon={<Shield size={24} />}
            title="É gratuito?"
            description="O acesso à informação é gratuito. Custos são cobrados apenas para reprodução de documentos, conforme legislação vigente."
          />
        </div>

        {/* Como solicitar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText size={22} className="text-blue-600" />Como Solicitar Informações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <StepItem number={1} title="Identifique a informação" description="Descreva claramente qual informação você deseja obter. Quanto mais detalhada a solicitação, mais rápida será a resposta." />
              <StepItem number={2} title="Escolha o canal" description="Você pode solicitar presencialmente, por telefone, e-mail ou pelo Portal 2909 de Atendimento ao Cidadão." />
              <StepItem number={3} title="Acompanhe sua solicitação" description="Após o envio, você receberá um número de protocolo para acompanhar o andamento do seu pedido." />
            </div>
            <div className="space-y-4">
              <StepItem number={4} title="Receba a resposta" description="A resposta será enviada no prazo de até 20 dias, podendo ser prorrogado por mais 10 dias." />
              <StepItem number={5} title="Caso não esteja satisfeito" description="Você pode apresentar recurso à autoridade hierarquicamente superior se a resposta não for satisfatória." />
              <StepItem number={6} title="Recurso à CGU" description="Em última instância, o cidadão pode recorrer à Controladoria-Geral da União (CGU)." />
            </div>
          </div>
        </div>

        {/* Transparência Ativa */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={22} className="text-blue-600" />Transparência Ativa
          </h2>
          <p className="text-gray-600 mb-6">
            A Prefeitura de Belford Roxo disponibiliza as seguintes informações de forma proativa:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Estrutura organizacional",
              "Receitas e despesas",
              "Licitações e contratos",
              "Programas e ações",
              "Perguntas frequentes",
              "Repasses e transferências",
              "Diárias e passagens",
              "Servidores públicos",
              "Convênios e parcerias",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 p-3 bg-white rounded-lg text-sm text-gray-700">
                <FileText size={16} className="text-blue-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Links úteis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ExternalLink size={22} className="text-blue-600" />Links Úteis
            </h2>
            <div className="space-y-3">
              {[
                { label: "Portal da Transparência - Belford Roxo", url: "https://prefeituradebelfordroxo.rj.gov.br" },
                { label: "Lei 12.527/2011 - Texto Integral", url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" },
                { label: "Controladoria-Geral da União (CGU)", url: "https://www.gov.br/cgu" },
                { label: "Portal 2909 - Fazer Solicitação", url: "/solicitacao" },
              ].map(link => (
                <a key={link.label} href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg text-sm text-blue-700 hover:bg-blue-50 transition-colors border border-gray-100">
                  <ExternalLink size={16} className="shrink-0" />{link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={22} className="text-blue-600" />Contato do SIC
            </h2>
            <p className="text-sm text-gray-500 mb-4">Serviço de Informação ao Cidadão (SIC)</p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Endereço</p>
                  <p className="text-gray-600">Rua São Bernardo, s/nº - Centro, Belford Roxo/RJ - CEP: 26130-010</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Telefone</p>
                  <p className="text-gray-600">(21) 2761-2909</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">E-mail</p>
                  <p className="text-gray-600">sic@belfordroxo.rj.gov.br</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Horário</p>
                  <p className="text-gray-600">Segunda a sexta, 9h às 17h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Precisa de uma informação pública?</h2>
          <p className="text-blue-100 mb-6">Registre sua solicitação pelo Portal 2909 e acompanhe pelo número do protocolo.</p>
          <Link href="/solicitacao" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            <FileText size={18} />Fazer Solicitação
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">{icon}</div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{number}</div>
      <div>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
