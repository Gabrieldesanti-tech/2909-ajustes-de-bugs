"use client";

import { useState } from "react";
import { Settings, Clock, Bell, Shield, FileText, Save, CheckCircle } from "lucide-react";

// =============================================================================
// Página de Configurações do Sistema (Admin)
// =============================================================================
// Funcionalidades:
// - Configuração de prazos SLA
// - Status configuráveis
// - Textos institucionais editáveis
// - Parâmetros do sistema
// =============================================================================

interface SlaConfig {
  priority: string;
  label: string;
  hours: number;
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("sla");
  const [saved, setSaved] = useState(false);

  // Configurações de SLA
  const [slaConfigs, setSlaConfigs] = useState<SlaConfig[]>([
    { priority: "URGENT", label: "Urgente", hours: 24 },
    { priority: "HIGH", label: "Alta prioridade", hours: 48 },
    { priority: "NORMAL", label: "Normal", hours: 120 },
    { priority: "LOW", label: "Baixa prioridade", hours: 240 },
  ]);

  // Configurações gerais
  const [generalConfig, setGeneralConfig] = useState({
    siteName: "Portal 2909",
    siteDescription: "Central de atendimento ao cidadão da Prefeitura de Belford Roxo",
    mainPhone: "2909",
    alternativePhone: "(21) 2666-2909",
    email: "ouvidoriageral@prefeituradebelfordroxo.rj.gov.br",
    workingHours: "Segunda a Sexta: 8h às 17h",
    maxFileSize: 10,
    maxFilesPerRequest: 5,
    allowAnonymous: true,
    requireEmailVerification: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "sla", label: "SLA e Prazos", icon: Clock },
    { id: "general", label: "Configurações Gerais", icon: Settings },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "texts", label: "Textos Institucionais", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
          <p className="text-sm text-gray-500 mt-1">
            Parametrização do sistema
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
            <CheckCircle size={16} />
            Salvo com sucesso!
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Tabs laterais */}
        <div className="w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {/* SLA */}
          {activeTab === "sla" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Configuração de SLA e Prazos
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Defina os prazos de atendimento por nível de prioridade. Os prazos são calculados em horas a partir da abertura da solicitação.
              </p>
              <div className="space-y-4">
                {slaConfigs.map((config, index) => (
                  <div key={config.priority} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-40">
                      <p className="font-medium text-gray-800">{config.label}</p>
                      <p className="text-xs text-gray-500">{config.priority}</p>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Prazo (horas)</label>
                      <input
                        type="number"
                        value={config.hours}
                        onChange={(e) => {
                          const updated = [...slaConfigs];
                          updated[index].hours = parseInt(e.target.value) || 0;
                          setSlaConfigs(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        min={1}
                      />
                    </div>
                    <div className="text-sm text-gray-500 w-24 text-right">
                      = {Math.floor(config.hours / 24)} dia{Math.floor(config.hours / 24) !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Geral */}
          {activeTab === "general" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Configurações Gerais
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ConfigField
                    label="Nome do Portal"
                    value={generalConfig.siteName}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, siteName: v })}
                  />
                  <ConfigField
                    label="Telefone Principal"
                    value={generalConfig.mainPhone}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, mainPhone: v })}
                  />
                  <ConfigField
                    label="Telefone Alternativo"
                    value={generalConfig.alternativePhone}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, alternativePhone: v })}
                  />
                  <ConfigField
                    label="E-mail de Contato"
                    value={generalConfig.email}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, email: v })}
                  />
                  <ConfigField
                    label="Horário de Atendimento"
                    value={generalConfig.workingHours}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, workingHours: v })}
                  />
                  <ConfigField
                    label="Tamanho Máximo de Arquivo (MB)"
                    value={generalConfig.maxFileSize.toString()}
                    onChange={(v) => setGeneralConfig({ ...generalConfig, maxFileSize: parseInt(v) || 10 })}
                    type="number"
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={generalConfig.allowAnonymous}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, allowAnonymous: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Permitir solicitações anônimas</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={generalConfig.requireEmailVerification}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, requireEmailVerification: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Exigir verificação de e-mail no cadastro</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Configurações de Notificações
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Notificar cidadão ao mudar status", key: "statusChange", checked: true },
                  { label: "Notificar atendente sobre novas solicitações", key: "newRequest", checked: true },
                  { label: "Alertar gestores sobre SLA prestes a expirar", key: "slaWarning", checked: true },
                  { label: "Alertar gestores sobre SLA expirado", key: "slaBreach", checked: true },
                  { label: "Notificar sobre novos comentários", key: "newComment", checked: false },
                  { label: "Enviar resumo diário por e-mail", key: "dailySummary", checked: false },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="rounded"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Configurações de Segurança
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Política de Senhas</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Pelo menos uma letra maiúscula</li>
                    <li>Pelo menos uma letra minúscula</li>
                    <li>Pelo menos um número</li>
                    <li>Hash com bcrypt (custo 12)</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">LGPD - Proteção de Dados</h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                    <li>Dados pessoais criptografados em trânsito (HTTPS)</li>
                    <li>Soft delete para atender requisições de exclusão</li>
                    <li>Logs de auditoria completos e imutáveis</li>
                    <li>Consentimento registrado no cadastro</li>
                    <li>Consultas públicas sanitizadas (sem dados pessoais)</li>
                    <li>Exportação de dados pessoais disponível</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Sessões e Autenticação</h4>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
                    <li>JWT com expiração de 8 horas</li>
                    <li>Cookie httpOnly + Secure (proteção XSS)</li>
                    <li>Rate limiting: 60 req/min por IP</li>
                    <li>Headers de segurança (CORS, X-Frame-Options, etc.)</li>
                    <li>Sessões armazenadas no banco para invalidação</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Textos */}
          {activeTab === "texts" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Textos Institucionais
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Edite os textos que aparecem nas páginas institucionais do portal.
              </p>
              <div className="space-y-4">
                {[
                  { slug: "termos-uso", title: "Termos de Uso" },
                  { slug: "politica-privacidade", title: "Política de Privacidade" },
                  { slug: "lei-acesso-informacao", title: "Lei de Acesso à Informação" },
                  { slug: "ouvidoria", title: "Ouvidoria" },
                ].map((text) => (
                  <div key={text.slug} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{text.title}</p>
                      <p className="text-xs text-gray-500">/{text.slug}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfigField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
