import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Cartilha ao Cidadão",
  description:
    "Baixe a Cartilha ao Cidadão com informações sobre serviços e canais de atendimento 2909 da Prefeitura de Belford Roxo.",
};

const PDF_URL =
  "https://transparencia.prefeituradebelfordroxo.rj.gov.br/ver20230623/tmp/PortalServices/CARTA_FUNBEL.pdf";

export default function CartilhaPage() {
  return (
    <div className="container-main py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1748ae] hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Voltar para o início
        </Link>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div
            className="px-6 md:px-10 py-8 md:py-10 text-center"
            style={{
              background: "linear-gradient(135deg, #1748ae 0%, #0d3380 100%)",
            }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Cartilha ao Cidadão
            </h1>
          </div>

          <div className="px-6 md:px-10 py-8 md:py-10 space-y-6">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Abaixo, você consegue baixar o arquivo que contém a{" "}
              <strong>Cartilha ao Cidadão</strong>, documento que esclarece
              processos e detalha a utilização de todos os canais de atendimento
              2909.
            </p>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              A Cartilha orienta como solicitar serviços municipais e
              informações sobre serviços e processos da Prefeitura de Belford
              Roxo. O documento contém também esclarecimentos sobre os portais
              da prefeitura.
            </p>

            <div className="pt-4 text-center">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#1748ae] hover:bg-[#0d3380] text-white font-bold rounded-lg transition-colors shadow-lg text-base md:text-lg"
              >
                <Download size={22} />
                Baixar Cartilha ao Cidadão (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
