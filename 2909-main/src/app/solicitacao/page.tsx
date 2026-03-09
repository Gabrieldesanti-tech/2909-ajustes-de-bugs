"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Upload, X, CheckCircle, Copy, AlertTriangle, Loader2 } from "lucide-react";
import Steps from "@/components/ui/Steps";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatCEP } from "@/lib/utils";

const steps = [
  { id: 1, name: "INFORMAÇÃO" },
  { id: 2, name: "SOLICITAÇÃO" },
  { id: 3, name: "CONFIRMAÇÃO" },
];

interface ServiceOption {
  id: string;
  name: string;
  slug: string;
  description: string;
  slaHours: number;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  services: ServiceOption[];
}

function SolicitacaoContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const serviceSlug = searchParams.get("service") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [protocol, setProtocol] = useState("");

  // Dados do banco
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Step 1 - Seleção de serviço
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  // Step 2 - Dados da solicitação
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "Belford Roxo",
    state: "RJ",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedService = selectedCategory?.services.find((s) => s.id === selectedServiceId);

  // Buscar categorias e serviços do banco
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      const res = await fetch("/api/v1/services");
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data);

        // Se veio com slugs na URL, pré-selecionar
        if (categorySlug) {
          const cat = json.data.find((c: CategoryOption) => c.slug === categorySlug);
          if (cat) {
            setSelectedCategoryId(cat.id);
            if (serviceSlug) {
              const svc = cat.services.find((s: ServiceOption) => s.slug === serviceSlug);
              if (svc) setSelectedServiceId(svc.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoadingServices(false);
    }
  }, [categorySlug, serviceSlug]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const validFiles = newFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024 // 10MB max
    );
    setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCEPChange = async (value: string) => {
    const formatted = formatCEP(value.replace(/\D/g, "").slice(0, 8));
    setAddress((prev) => ({ ...prev, zipCode: formatted }));

    if (formatted.replace(/\D/g, "").length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${formatted.replace(/\D/g, "")}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "Belford Roxo",
            state: data.uf || "RJ",
          }));
        }
      } catch {
        // Ignorar erros de CEP
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedServiceId) {
      setCurrentStep(2);
    } else if (currentStep === 2 && description.length >= 20) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!selectedServiceId) throw new Error("Serviço não selecionado");

      const res = await fetch("/api/v1/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          description,
          address: address.zipCode ? address : undefined,
          isAnonymous,
          origin: "PORTAL",
        }),
      });

      const json = await res.json();

      if (json.success && json.data?.protocol) {
        setProtocol(json.data.protocol);
        setCurrentStep(3);
      } else {
        alert(json.error || "Erro ao enviar solicitação. Tente novamente.");
      }
    } catch {
      alert("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProtocol = () => {
    navigator.clipboard.writeText(protocol);
  };

  if (loadingServices) {
    return (
      <div className="container-main py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin mr-3 text-primary" size={24} />
          <span className="text-neutral-600">Carregando serviços...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Conteúdo principal */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-neutral-500">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Portal 2909
                </Link>
              </li>
              <ChevronRight size={14} />
              <li className="text-primary font-medium">Enviar uma solicitação</li>
            </ol>
          </nav>

          <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100">
              <h1 className="text-2xl font-bold text-neutral-800">
                Enviar uma solicitação
              </h1>
            </div>

            {/* Steps */}
            <div className="px-6 py-6 border-b border-neutral-100 bg-neutral-50">
              <Steps steps={steps} currentStep={currentStep} />
            </div>

            {/* Conteúdo do Step */}
            <div className="p-6">
              {/* Step 1 - Seleção de serviço */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Selecione a categoria *
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => {
                        setSelectedCategoryId(e.target.value);
                        setSelectedServiceId("");
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCategoryId && selectedCategory && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Selecione o serviço *
                      </label>
                      <select
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Selecione um serviço</option>
                        {selectedCategory.services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedService && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h3 className="font-medium text-primary mb-1">
                        {selectedService.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {selectedService.description}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Prazo estimado: {selectedService.slaHours <= 24 ? `${selectedService.slaHours} horas` : `${Math.round(selectedService.slaHours / 24)} dias úteis`}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleNextStep}
                      disabled={!selectedServiceId}
                      rightIcon={<ChevronRight size={18} />}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 - Dados da solicitação */}
              {currentStep === 2 && selectedService && (
                <div className="space-y-6">
                  {/* Info do serviço selecionado */}
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium">Serviço:</span> {selectedCategory?.name} &gt; {selectedService.name}
                    </p>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Descrição da solicitação *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Descreva detalhadamente sua solicitação..."
                      required
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      {description.length < 20
                        ? `Mínimo de 20 caracteres (faltam ${20 - description.length})`
                        : `${description.length} caracteres`}
                    </p>
                  </div>

                  {/* Endereço */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-neutral-800">
                      Localização (se aplicável)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="CEP"
                        value={address.zipCode}
                        onChange={(e) => handleCEPChange(e.target.value)}
                        placeholder="00000-000"
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Rua"
                          value={address.street}
                          onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                          }
                          placeholder="Nome da rua"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Número"
                        value={address.number}
                        onChange={(e) =>
                          setAddress({ ...address, number: e.target.value })
                        }
                        placeholder="Nº"
                      />
                      <Input
                        label="Complemento"
                        value={address.complement}
                        onChange={(e) =>
                          setAddress({ ...address, complement: e.target.value })
                        }
                        placeholder="Apto, bloco..."
                      />
                      <Input
                        label="Bairro"
                        value={address.neighborhood}
                        onChange={(e) =>
                          setAddress({ ...address, neighborhood: e.target.value })
                        }
                        placeholder="Bairro"
                      />
                    </div>
                  </div>

                  {/* Upload de arquivos */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Anexos (opcional)
                    </label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="files"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="files"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload size={32} className="text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-600">
                          Clique para anexar fotos ou documentos
                        </span>
                        <span className="text-xs text-neutral-400 mt-1">
                          Máximo 5 arquivos, 10MB cada
                        </span>
                      </label>
                    </div>
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-2 bg-neutral-50 rounded"
                          >
                            <span className="text-sm truncate">{file.name}</span>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Opção anônimo */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="anonymous" className="text-sm">
                      <span className="font-medium text-amber-800">
                        Enviar como anônimo
                      </span>
                      <p className="text-amber-700 mt-1">
                        Seus dados não serão vinculados a esta solicitação.
                        <br />
                        <AlertTriangle
                          size={14}
                          className="inline mr-1"
                        />
                        <span className="text-xs">
                          Nota: Solicitações anônimas podem ter tempo de resposta maior.
                        </span>
                      </p>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Voltar
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={description.length < 20}
                      isLoading={isLoading}
                      rightIcon={<ChevronRight size={18} />}
                    >
                      Enviar solicitação
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 - Confirmação */}
              {currentStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                    Solicitação enviada com sucesso!
                  </h2>
                  <p className="text-neutral-600 mb-6">
                    Sua solicitação foi registrada e será analisada em breve.
                  </p>

                  {/* Protocolo */}
                  <div className="inline-flex items-center gap-2 px-6 py-4 bg-primary/10 rounded-lg mb-6">
                    <span className="text-sm text-neutral-600">
                      Número do protocolo:
                    </span>
                    <span className="text-xl font-bold text-primary font-mono">
                      {protocol}
                    </span>
                    <button
                      onClick={copyProtocol}
                      className="p-2 hover:bg-primary/20 rounded transition-colors"
                      title="Copiar protocolo"
                    >
                      <Copy size={18} className="text-primary" />
                    </button>
                  </div>

                  <p className="text-sm text-neutral-500 mb-8">
                    Guarde este número para acompanhar o andamento da sua
                    solicitação.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={`/consulta?protocolo=${protocol}`}
                      className="btn-primary px-6 py-3"
                    >
                      Acompanhar solicitação
                    </Link>
                    <Link href="/" className="btn-outline px-6 py-3">
                      Voltar ao início
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SolicitacaoPage() {
  return (
    <Suspense fallback={<div className="container-main py-8">Carregando...</div>}>
      <SolicitacaoContent />
    </Suspense>
  );
}
