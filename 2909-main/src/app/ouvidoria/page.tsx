import Link from "next/link";
import { ChevronRight, MessageSquare, AlertTriangle, ThumbsUp, Lightbulb, FileText } from "lucide-react";

const ouvidoriaTypes = [
  {
    id: "denuncia",
    title: "Denúncia",
    description: "Relatar irregularidades, abusos ou condutas ilegais",
    icon: AlertTriangle,
    color: "text-red-600 bg-red-100",
    href: "/solicitacao?category=ouvidoria&service=denuncia",
  },
  {
    id: "reclamacao",
    title: "Reclamação",
    description: "Expressar insatisfação com serviços ou atendimentos",
    icon: MessageSquare,
    color: "text-orange-600 bg-orange-100",
    href: "/solicitacao?category=ouvidoria&service=reclamacao",
  },
  {
    id: "sugestao",
    title: "Sugestão",
    description: "Propor melhorias para os serviços públicos",
    icon: Lightbulb,
    color: "text-blue-600 bg-blue-100",
    href: "/solicitacao?category=ouvidoria&service=sugestao",
  },
  {
    id: "elogio",
    title: "Elogio",
    description: "Reconhecer um bom atendimento ou serviço",
    icon: ThumbsUp,
    color: "text-green-600 bg-green-100",
    href: "/solicitacao?category=ouvidoria&service=elogio",
  },
  {
    id: "solicitacao",
    title: "Solicitação de Informação",
    description: "Requisitar informações sobre serviços ou procedimentos",
    icon: FileText,
    color: "text-purple-600 bg-purple-100",
    href: "/lai",
  },
];

export default function OuvidoriaPage() {
  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2 text-neutral-500">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Portal 2909
              </Link>
            </li>
            <ChevronRight size={14} />
            <li className="text-primary font-medium">Ouvidoria</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Ouvidoria Municipal</h1>
            <p className="text-white/90 text-lg">
              Canal de comunicação direta entre o cidadão e a administração pública
            </p>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 mb-4">
              A Ouvidoria da Prefeitura de Belford Roxo é o canal responsável por receber, 
              examinar e encaminhar denúncias, reclamações, sugestões, elogios e demais 
              manifestações dos cidadãos, garantindo uma administração pública mais 
              transparente e eficiente.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-medium">Telefone:</span>
                <span className="text-primary font-semibold">2909</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-medium">E-mail:</span>
                <a
                  href="mailto:ouvidoriageral@prefeituradebelfordroxo.rj.gov.br"
                  className="text-primary hover:underline"
                >
                  ouvidoriageral@prefeituradebelfordroxo.rj.gov.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de manifestação */}
        <h2 className="text-xl font-bold text-neutral-800 mb-4">
          Escolha o tipo de manifestação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {ouvidoriaTypes.map((type) => (
            <Link
              key={type.id}
              href={type.href}
              className="bg-white rounded-lg shadow-card border border-neutral-100 p-6 hover:shadow-soft transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color}`}
                >
                  <type.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {type.description}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-neutral-400 group-hover:text-primary transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Informações adicionais */}
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <h3 className="font-semibold text-neutral-800 mb-3">
            Informações importantes
          </h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                Suas manifestações serão tratadas com sigilo e respeito, conforme
                a Lei Geral de Proteção de Dados (LGPD).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                Denúncias podem ser feitas de forma anônima. Porém, denúncias
                identificadas permitem um acompanhamento mais efetivo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                O prazo para resposta é de até 20 dias úteis, podendo ser
                prorrogado mediante justificativa.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                Após enviar sua manifestação, você receberá um número de
                protocolo para acompanhamento.
              </span>
            </li>
          </ul>
        </div>

        {/* Link para consulta */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600 mb-2">Já enviou uma manifestação?</p>
          <Link
            href="/consulta"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Consulte o andamento pelo protocolo
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
