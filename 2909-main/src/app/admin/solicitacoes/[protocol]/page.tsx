"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  FileText,
  Send,
  AlertTriangle,
  CheckCircle,
  Paperclip,
  MessageSquare,
  History,
} from "lucide-react";

// =============================================================================
// Página de Detalhe da Solicitação (Admin)
// =============================================================================
// Funcionalidades:
// - Visualização completa com todos os dados
// - Linha do tempo (histórico de mudanças)
// - Alteração de status com rastreabilidade
// - Comentários internos e públicos
// - Informações do cidadão
// - Indicador de SLA
// =============================================================================

interface RequestDetail {
  id: string;
  protocol: string;
  status: string;
  origin: string;
  description: string;
  isAnonymous: boolean;
  slaBreached: boolean;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  rating: number | null;
  ratingComment: string | null;
  service: { name: string; category: { name: string } };
  address: { street: string; number: string; complement: string; neighborhood: string; city: string; state: string; zipCode: string } | null;
  user: { name: string; email: string } | null;
  assignee: { name: string } | null;
  department: { name: string } | null;
  attachments: { id: string; fileName: string; fileUrl: string; fileType: string; fileSize: number }[];
  history: { id: string; fromStatus: string; toStatus: string; message: string; isPublic: boolean; userName: string; createdAt: string }[];
  comments: { id: string; content: string; isInternal: boolean; user: { name: string }; createdAt: string }[];
}

const STATUS_OPTIONS: Record<string, { value: string; label: string }[]> = {
  ALL: [
    { value: "PENDING", label: "Aguardando análise" },
    { value: "IN_PROGRESS", label: "Em andamento" },
    { value: "WAITING_INFO", label: "Aguardando informações" },
    { value: "FORWARDED", label: "Encaminhado" },
    { value: "RESOLVED", label: "Resolvido" },
    { value: "CLOSED", label: "Encerrado" },
    { value: "CANCELLED", label: "Cancelado" },
    { value: "REOPENED", label: "Reaberto" },
  ],
};

// Transições válidas por status atual
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["IN_PROGRESS", "FORWARDED", "RESOLVED", "CANCELLED"],
  IN_PROGRESS: ["WAITING_INFO", "FORWARDED", "RESOLVED", "CANCELLED"],
  WAITING_INFO: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
  FORWARDED: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  CANCELLED: ["REOPENED"],
  REOPENED: ["IN_PROGRESS", "FORWARDED", "RESOLVED"],
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  WAITING_INFO: "bg-orange-100 text-orange-800 border-orange-200",
  FORWARDED: "bg-purple-100 text-purple-800 border-purple-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REOPENED: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando análise",
  IN_PROGRESS: "Em andamento",
  WAITING_INFO: "Aguardando informações",
  FORWARDED: "Encaminhado",
  RESOLVED: "Resolvido",
  CLOSED: "Encerrado",
  CANCELLED: "Cancelado",
  REOPENED: "Reaberto",
};

export default function SolicitacaoDetailPage({
  params,
}: {
  params: Promise<{ protocol: string }>;
}) {
  const resolvedParams = use(params);
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para alteração de status
  const [newStatus, setNewStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPublicHistory, setIsPublicHistory] = useState(true);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  // Estado para comentários
  const [commentText, setCommentText] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [resolvedParams.protocol]);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/v1/requests/${resolvedParams.protocol}`);
      const json = await res.json();
      if (json.success) {
        setRequest(json.data);
        setNewStatus("");
      } else {
        setError(json.error || "Solicitação não encontrada");
      }
    } catch {
      setError("Erro ao carregar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus || !statusMessage.trim()) return;

    setSubmittingStatus(true);
    setStatusError("");
    try {
      const res = await fetch(`/api/v1/requests/${resolvedParams.protocol}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          message: statusMessage.trim(),
          isPublic: isPublicHistory,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage("");
        setNewStatus("");
        setStatusError("");
        fetchRequest(); // Recarregar dados
      } else {
        setStatusError(json.error || "Erro ao atualizar status");
      }
    } catch {
      setStatusError("Erro de conexão ao atualizar status");
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/v1/requests/${resolvedParams.protocol}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText.trim(),
          isInternal: isInternalComment,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCommentText("");
        fetchRequest();
      }
    } catch {
      alert("Erro ao adicionar comentário");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        Carregando solicitação...
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-800">{error || "Solicitação não encontrada"}</p>
        <Link href="/admin/solicitacoes" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar à lista
        </Link>
      </div>
    );
  }

  const slaDeadlineDate = new Date(request.slaDeadline);
  const isOverdue = request.slaBreached || slaDeadlineDate < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/solicitacoes"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              Protocolo: <span className="font-mono text-blue-600">{request.protocol}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                STATUS_COLORS[request.status] || "bg-gray-100 text-gray-800"
              }`}>
                {STATUS_LABELS[request.status] || request.status}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
                  <AlertTriangle size={14} />
                  SLA Expirado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados da solicitação */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Dados da Solicitação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InfoField label="Serviço" value={request.service.name} />
              <InfoField label="Categoria" value={request.service.category.name} />
              <InfoField label="Origem" value={request.origin} />
              <InfoField
                label="Data de abertura"
                value={new Date(request.createdAt).toLocaleString("pt-BR")}
              />
              <InfoField
                label="Prazo SLA"
                value={slaDeadlineDate.toLocaleString("pt-BR")}
                highlight={isOverdue}
              />
              {request.resolvedAt && (
                <InfoField
                  label="Resolvido em"
                  value={new Date(request.resolvedAt).toLocaleString("pt-BR")}
                />
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Descrição</p>
              <p className="text-gray-800 bg-gray-50 rounded-lg p-4 leading-relaxed">
                {request.description}
              </p>
            </div>
          </div>

          {/* Endereço */}
          {request.address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Localização
              </h2>
              <p className="text-gray-800">
                {request.address.street}, {request.address.number}
                {request.address.complement ? ` - ${request.address.complement}` : ""}
              </p>
              <p className="text-gray-600">
                {request.address.neighborhood} - {request.address.city}/{request.address.state} - CEP: {request.address.zipCode}
              </p>
            </div>
          )}

          {/* Linha do tempo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} />
              Linha do Tempo
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {request.history.map((item, index) => (
                  <div key={item.id} className="relative flex gap-4 pl-10">
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                      index === request.history.length - 1
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    }`} />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          STATUS_COLORS[item.toStatus] || "bg-gray-100"
                        }`}>
                          {STATUS_LABELS[item.toStatus] || item.toStatus}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.message}</p>
                      {item.userName && (
                        <p className="text-xs text-gray-400 mt-1">por {item.userName}</p>
                      )}
                      {!item.isPublic && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                          Interno
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comentários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comentários
            </h2>

            {request.comments && request.comments.length > 0 ? (
              <div className="space-y-3 mb-6">
                {request.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg ${
                      comment.isInternal
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    {comment.isInternal && (
                      <span className="text-xs text-orange-600 mt-1 inline-block">
                        Comentário interno
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">Nenhum comentário</p>
            )}

            {/* Adicionar comentário */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                placeholder="Escreva um comentário..."
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-600">Comentário interno (não visível ao cidadão)</span>
                </label>
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                  {submittingComment ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>

          {/* Anexos */}
          {request.attachments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Paperclip size={20} />
                Anexos ({request.attachments.length})
              </h2>
              <div className="space-y-2">
                {request.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{att.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {att.fileType} - {(att.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Alterar Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Alterar Status</h3>
            {(() => {
              const allowedTransitions = VALID_TRANSITIONS[request.status] || [];
              const availableOptions = STATUS_OPTIONS.ALL.filter(opt => allowedTransitions.includes(opt.value));

              if (availableOptions.length === 0) {
                return (
                  <div className="text-center py-4">
                    <CheckCircle size={24} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Não há transições disponíveis para o status atual.</p>
                  </div>
                );
              }

              return (
                <form onSubmit={handleStatusUpdate} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Novo status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Selecione um status...</option>
                      {availableOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Justificativa</label>
                    <textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Descreva o motivo da alteração..."
                      required
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isPublicHistory}
                      onChange={(e) => setIsPublicHistory(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-600">Visível ao cidadão</span>
                  </label>
                  {statusError && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{statusError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={!newStatus || !statusMessage.trim() || submittingStatus}
                    className="w-full py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    {submittingStatus ? "Atualizando..." : "Atualizar Status"}
                  </button>
                </form>
              );
            })()}
          </div>

          {/* Cidadão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={18} />
              Cidadão
            </h3>
            {request.isAnonymous ? (
              <p className="text-sm text-gray-500 italic">Solicitação anônima</p>
            ) : request.user ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-800">{request.user.name}</p>
                <p className="text-gray-600">{request.user.email}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Usuário não identificado</p>
            )}
          </div>

          {/* Info SLA */}
          <div className={`rounded-xl shadow-sm border p-6 ${
            isOverdue ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          }`}>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={18} />
              SLA
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prazo:</span>
                <span className="font-medium">
                  {slaDeadlineDate.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                  {isOverdue ? "Expirado" : "No prazo"}
                </span>
              </div>
              {!isOverdue && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Restante:</span>
                  <span className="font-medium">
                    {Math.ceil((slaDeadlineDate.getTime() - Date.now()) / (1000 * 60 * 60))}h
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Atribuição */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Atribuição</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Responsável:</span>
                <span className="font-medium">
                  {request.assignee?.name || "Não atribuído"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Secretaria:</span>
                <span className="font-medium">
                  {request.department?.name || "Não definida"}
                </span>
              </div>
            </div>
          </div>

          {/* Avaliação (se houver) */}
          {request.rating && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                Avaliação do Cidadão
              </h3>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= request.rating! ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {request.rating}/5
                </span>
              </div>
              {request.ratingComment && (
                <p className="text-sm text-gray-600 italic">
                  &ldquo;{request.ratingComment}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm font-medium ${highlight ? "text-red-600" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
