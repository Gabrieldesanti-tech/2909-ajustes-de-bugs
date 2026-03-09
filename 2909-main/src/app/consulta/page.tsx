"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatDateTime, formatStatus, getStatusColor } from "@/lib/utils";

interface RequestData {
  protocol: string;
  serviceName: string;
  categoryName: string;
  status: string;
  description: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  history: {
    status: string;
    message: string;
    createdAt: string;
  }[];
}

function ConsultaContent() {
  const searchParams = useSearchParams();
  const protocolParam = searchParams.get("protocolo") || "";

  const [protocol, setProtocol] = useState(protocolParam);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestData, setRequestData] = useState<RequestData | null>(null);

  useEffect(() => {
    if (protocolParam) {
      setProtocol(protocolParam);
      handleSearch(protocolParam);
    }
  }, [protocolParam]);

  const handleSearch = async (searchProtocol?: string) => {
    const protocolToSearch = searchProtocol || protocol;
    if (!protocolToSearch.trim()) {
      setError("Digite o número do protocolo");
      return;
    }

    setIsLoading(true);
    setError("");
    setRequestData(null);

    try {
      const res = await fetch(`/api/v1/requests/${encodeURIComponent(protocolToSearch)}`);
      const json = await res.json();

      if (json.success && json.data) {
        const data = json.data;
        setRequestData({
          protocol: data.protocol,
          serviceName: data.serviceName || data.service?.name || "Serviço",
          categoryName: data.categoryName || data.service?.category?.name || "Categoria",
          status: data.status?.toLowerCase().replace(/_/g, "_") || data.status,
          description: data.description,
          address: data.address
            ? `${data.address.street || ""}, ${data.address.number || ""} - ${data.address.neighborhood || ""}, ${data.address.city || "Belford Roxo"}/${data.address.state || "RJ"}`
            : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          history: (data.history || []).map((h: { status?: string; toStatus?: string; message: string; createdAt: string }) => ({
            status: (h.toStatus || h.status || "").toLowerCase(),
            message: h.message,
            createdAt: h.createdAt,
          })),
        });
      } else {
        setError(json.error || "Protocolo não encontrado. Verifique o número e tente novamente.");
      }
    } catch {
      setError("Erro ao buscar protocolo. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "in_progress":
        return <Loader2 className="text-blue-600 animate-spin" size={20} />;
      case "resolved":
      case "closed":
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Consulta de Protocolo
          </h1>
          <p className="text-neutral-600">
            Digite o número do protocolo para acompanhar sua solicitação
          </p>
        </div>

        {/* Formulário de busca */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-100 p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Input
                value={protocol}
                onChange={(e) => setProtocol(e.target.value.toUpperCase())}
                placeholder="Digite o número do protocolo"
                leftIcon={<FileText size={18} />}
              />
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Search size={18} />}
            >
              Consultar
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>

        {/* Resultado da consulta */}
        {requestData && (
          <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden animate-in">
            {/* Header do resultado */}
            <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Protocolo</p>
                  <p className="text-2xl font-bold text-primary font-mono">
                    {requestData.protocol}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    requestData.status
                  )}`}
                >
                  {formatStatus(requestData.status)}
                </span>
              </div>
            </div>

            {/* Detalhes */}
            <div className="p-6 space-y-6">
              {/* Info do serviço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Serviço</p>
                  <p className="font-medium text-neutral-800">
                    {requestData.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Categoria</p>
                  <p className="font-medium text-neutral-800">
                    {requestData.categoryName}
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <p className="text-sm text-neutral-500 mb-1">Descrição</p>
                <p className="text-neutral-800">{requestData.description}</p>
              </div>

              {/* Endereço */}
              {requestData.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Local</p>
                    <p className="text-neutral-800">{requestData.address}</p>
                  </div>
                </div>
              )}

              {/* Datas */}
              <div className="flex items-start gap-6">
                <div className="flex items-start gap-2">
                  <Calendar size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Abertura</p>
                    <p className="text-neutral-800">
                      {formatDateTime(requestData.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Última atualização</p>
                    <p className="text-neutral-800">
                      {formatDateTime(requestData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div>
                <h3 className="font-semibold text-neutral-800 mb-4">
                  Histórico de atualizações
                </h3>
                <div className="space-y-4">
                  {requestData.history.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-neutral-800">{item.message}</p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Link para nova solicitação */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">Precisa abrir uma nova solicitação?</p>
          <Link
            href="/solicitacao"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Clique aqui para abrir uma solicitação
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConsultaPage() {
  return (
    <Suspense fallback={<div className="container-main py-8">Carregando...</div>}>
      <ConsultaContent />
    </Suspense>
  );
}
