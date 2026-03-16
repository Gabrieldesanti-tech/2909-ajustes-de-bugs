"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  BarChart3,
} from "lucide-react";

// =============================================================================
// Página de Relatórios (Admin)
// =============================================================================
// Funcionalidades:
// - Exportação em CSV, Excel e PDF
// - Filtros por período, status e tipo
// - Relatórios predefinidos (mensal, por secretaria, etc.)
// =============================================================================

export default function RelatoriosPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportCSV = async () => {
    setExporting("csv");
    try {
      const params = new URLSearchParams();
      params.set("format", "csv");
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (status) params.set("status", status);

      window.open(`/api/v1/admin/reports/export?${params.toString()}`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const params = new URLSearchParams();
      params.set("format", "json");
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (status) params.set("status", status);

      const res = await fetch(`/api/v1/admin/reports/export?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        // Importação dinâmica da lib xlsx (client-side only)
        const XLSX = await import("xlsx");
        
        const worksheet = XLSX.utils.json_to_sheet(json.data.map((r: Record<string, unknown>) => ({
          "Protocolo": r.protocol,
          "Data Abertura": r.createdAt ? new Date(r.createdAt as string).toLocaleDateString("pt-BR") : "",
          "Status": r.status,
          "Categoria": r.category,
          "Serviço": r.service,
          "Descrição": r.description,
          "Bairro": r.neighborhood,
          "Origem": r.origin,
          "Responsável": r.assignee,
          "Secretaria": r.department,
          "SLA Expirado": r.slaBreached ? "Sim" : "Não",
          "Data Resolução": r.resolvedAt ? new Date(r.resolvedAt as string).toLocaleDateString("pt-BR") : "",
          "Cidadão": r.citizenName,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitações");
        XLSX.writeFile(workbook, `relatorio-solicitacoes-${new Date().toISOString().split("T")[0]}.xlsx`);
      }
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      alert("Erro ao gerar arquivo Excel");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const params = new URLSearchParams();
      params.set("format", "json");
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (status) params.set("status", status);

      const res = await fetch(`/api/v1/admin/reports/export?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        // Importação dinâmica do jspdf (client-side only)
        const { default: jsPDF } = await import("jspdf");
        const autoTableModule = await import("jspdf-autotable");
        
        const doc = new jsPDF({ orientation: "landscape" });
        
        // Título
        doc.setFontSize(16);
        doc.text("Portal 2909 - Relatório de Solicitações", 14, 15);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 22);
        if (dateFrom || dateTo) {
          doc.text(`Período: ${dateFrom || "início"} a ${dateTo || "hoje"}`, 14, 28);
        }
        doc.text(`Total de registros: ${json.data.length}`, 14, 34);

        // Tabela
        const tableData = json.data.map((r: Record<string, unknown>) => [
          r.protocol,
          r.createdAt ? new Date(r.createdAt as string).toLocaleDateString("pt-BR") : "",
          r.status,
          r.category,
          r.service,
          (r.description as string || "").substring(0, 60),
          r.neighborhood,
          r.slaBreached ? "Sim" : "Não",
        ]);

        // Use autoTable
        if (typeof autoTableModule.default === "function") {
          autoTableModule.default(doc, {
            startY: 40,
            head: [["Protocolo", "Data", "Status", "Categoria", "Serviço", "Descrição", "Bairro", "SLA"]],
            body: tableData,
            styles: { fontSize: 7 },
            headStyles: { fillColor: [23, 72, 174] },
          });
        }

        doc.save(`relatorio-solicitacoes-${new Date().toISOString().split("T")[0]}.pdf`);
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao gerar arquivo PDF");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">
          Exporte dados para análise e prestação de contas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={18} />
          Filtros do Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data início</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data fim</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Todos</option>
              <option value="PENDING">Aguardando</option>
              <option value="IN_PROGRESS">Em andamento</option>
              <option value="RESOLVED">Resolvido</option>
              <option value="CLOSED">Encerrado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opções de exportação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExportCard
          title="Exportar CSV"
          description="Arquivo de texto separado por ponto-e-vírgula. Compatível com Excel, Google Sheets e LibreOffice."
          icon={<FileText size={32} className="text-green-600" />}
          buttonLabel="Baixar CSV"
          buttonColor="bg-green-600 hover:bg-green-700"
          loading={exporting === "csv"}
          onClick={handleExportCSV}
        />
        <ExportCard
          title="Exportar Excel"
          description="Planilha formatada .xlsx com todos os dados filtrados. Ideal para análise detalhada."
          icon={<FileSpreadsheet size={32} className="text-blue-600" />}
          buttonLabel="Baixar Excel"
          buttonColor="bg-blue-600 hover:bg-blue-700"
          loading={exporting === "excel"}
          onClick={handleExportExcel}
        />
        <ExportCard
          title="Exportar PDF"
          description="Relatório formatado em PDF. Ideal para impressão e envio para gestores."
          icon={<BarChart3 size={32} className="text-red-600" />}
          buttonLabel="Baixar PDF"
          buttonColor="bg-red-600 hover:bg-red-700"
          loading={exporting === "pdf"}
          onClick={handleExportPDF}
        />
      </div>

      {/* Relatórios predefinidos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Relatórios Predefinidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Relatório Mensal", desc: "Todas as solicitações do mês atual", period: "month" },
            { label: "Relatório Semanal", desc: "Solicitações dos últimos 7 dias", period: "week" },
            { label: "SLA Expirado", desc: "Solicitações que ultrapassaram o prazo", period: "sla" },
            { label: "Não Resolvidas", desc: "Solicitações pendentes e em andamento", period: "open" },
          ].map((report) => (
            <button
              key={report.period}
              onClick={() => {
                const now = new Date();
                if (report.period === "month") {
                  setDateFrom(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`);
                  setDateTo(now.toISOString().split("T")[0]);
                } else if (report.period === "week") {
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setDateFrom(weekAgo.toISOString().split("T")[0]);
                  setDateTo(now.toISOString().split("T")[0]);
                } else if (report.period === "sla") {
                  setStatus("");
                  setDateFrom("");
                  setDateTo("");
                } else if (report.period === "open") {
                  setStatus("PENDING");
                  setDateFrom("");
                  setDateTo("");
                }
              }}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{report.label}</p>
                <p className="text-xs text-gray-500">{report.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExportCard({
  title,
  description,
  icon,
  buttonLabel,
  buttonColor,
  loading,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
  buttonColor: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 flex-1 mb-4">{description}</p>
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full py-2.5 text-white text-sm rounded-lg transition-colors disabled:opacity-50 ${buttonColor}`}
      >
        <Download size={16} />
        {loading ? "Gerando..." : buttonLabel}
      </button>
    </div>
  );
}
