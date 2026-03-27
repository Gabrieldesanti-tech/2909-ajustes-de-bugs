"use client";

import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Building2,
  Clock3,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Wrench,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ApiEnvelope, ApiError, apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { categoryIconMap, getCategoryIcon } from "@/lib/icons";
import type {
  AdminCategoryItem,
  AdminServiceItem,
  DepartmentSummary,
  DetailedServiceInfo,
  ServiceField,
  SlaPriority,
} from "@/types";

const PRIORITY_LABELS: Record<SlaPriority, string> = {
  URGENT: "Urgente",
  HIGH: "Alta",
  NORMAL: "Normal",
  LOW: "Baixa",
};

const PRIORITY_COLORS: Record<SlaPriority, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  NORMAL: "bg-blue-100 text-blue-700",
  LOW: "bg-gray-100 text-gray-700",
};

const PRIORITY_OPTIONS: SlaPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];
const SUPPORTED_FIELD_TYPES = ["text", "textarea", "select", "date", "email", "phone", "cpf"] as const;
const CATEGORY_ICON_OPTIONS = Object.keys(categoryIconMap).sort((left, right) =>
  left.localeCompare(right, "pt-BR")
);

type SupportedServiceFieldType = (typeof SUPPORTED_FIELD_TYPES)[number];

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

type BuilderFieldOption = {
  value: string;
  label: string;
};

type BuilderField = {
  id: string;
  label: string;
  type: SupportedServiceFieldType;
  required: boolean;
  placeholder: string;
  options: BuilderFieldOption[];
};

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order: string;
  departmentId: string;
};

type DepartmentFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  isActive: boolean;
};

type ServiceFormState = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  slaHours: string;
  slaPriority: SlaPriority;
  requiresAuth: boolean;
  isActive: boolean;
  order: string;
  oQueE: string;
  paraQueServe: string;
  quemPodeSolicitar: string;
  informacoesComplementares: string;
  informacoesNecessarias: string;
  tempoAtendimento: string;
  legislacao: string;
  fields: BuilderField[];
  preservedFields: ServiceField[];
};

function createEmptyCategoryForm(): CategoryFormState {
  return {
    name: "",
    slug: "",
    icon: "FolderOpen",
    description: "",
    order: "",
    departmentId: "",
  };
}

function createEmptyDepartmentForm(): DepartmentFormState {
  return {
    name: "",
    slug: "",
    description: "",
    phone: "",
    isActive: true,
  };
}

function createEmptyServiceForm(defaultCategoryId = ""): ServiceFormState {
  return {
    name: "",
    slug: "",
    categoryId: defaultCategoryId,
    description: "",
    slaHours: "",
    slaPriority: "NORMAL",
    requiresAuth: false,
    isActive: true,
    order: "",
    oQueE: "",
    paraQueServe: "",
    quemPodeSolicitar: "",
    informacoesComplementares: "",
    informacoesNecessarias: "",
    tempoAtendimento: "",
    legislacao: "",
    fields: [],
    preservedFields: [],
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Não foi possível concluir a operação.";
}

function toOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function toOptionalStringArray(value: string) {
  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function isSupportedFieldType(type: string): type is SupportedServiceFieldType {
  return (SUPPORTED_FIELD_TYPES as readonly string[]).includes(type);
}

function createEmptyBuilderField(type: SupportedServiceFieldType = "text"): BuilderField {
  return {
    id: "",
    label: "",
    type,
    required: false,
    placeholder: "",
    options: type === "select" ? [{ value: "", label: "" }] : [],
  };
}

function getBuilderFieldsFromService(fields?: ServiceField[]) {
  const supportedFields: BuilderField[] = [];
  const preservedFields: ServiceField[] = [];

  for (const field of fields || []) {
    if (isSupportedFieldType(field.type)) {
      supportedFields.push({
        id: field.id || "",
        label: field.label || field.name || "",
        type: field.type,
        required: Boolean(field.required),
        placeholder: field.placeholder || "",
        options:
          field.type === "select"
            ? (field.options || []).map((option) => ({
                value: option.value || "",
                label: option.label || "",
              }))
            : [],
      });
      continue;
    }

    preservedFields.push(field);
  }

  return { supportedFields, preservedFields };
}

function buildServiceFieldsPayload(form: ServiceFormState) {
  const ids = new Set<string>();
  const fields: ServiceField[] = [];

  for (let index = 0; index < form.fields.length; index += 1) {
    const field = form.fields[index];
    const id = field.id.trim();
    const label = field.label.trim();

    if (!id) {
      return { error: `Preencha o código do campo ${index + 1}.` };
    }

    if (!label) {
      return { error: `Preencha o nome exibido do campo ${index + 1}.` };
    }

    if (ids.has(id)) {
      return { error: `O código "${id}" está repetido nos campos do formulário.` };
    }

    ids.add(id);

    const nextField: ServiceField = {
      id,
      label,
      name: label,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder.trim() || undefined,
    };

    if (field.type === "select") {
      const options = field.options
        .map((option) => ({
          value: option.value.trim(),
          label: option.label.trim(),
        }))
        .filter((option) => option.value && option.label);

      if (options.length === 0) {
        return { error: `Adicione ao menos uma opção válida no campo ${index + 1}.` };
      }

      nextField.options = options;
    }

    fields.push(nextField);
  }

  return {
    value: [...fields, ...form.preservedFields],
  };
}

function buildCategoryPayload(form: CategoryFormState) {
  const order = toOptionalNumber(form.order);

  if (Number.isNaN(order)) {
    return { error: "A ordem da categoria precisa ser um número válido." };
  }

  return {
    value: {
      name: form.name.trim(),
      slug: form.slug.trim(),
      icon: form.icon.trim(),
      description: form.description.trim() || undefined,
      order,
      departmentId: form.departmentId || undefined,
    },
  };
}

function buildDepartmentPayload(form: DepartmentFormState) {
  const name = form.name.trim();
  const slug = form.slug.trim();
  const description = form.description.trim();

  if (!name) {
    return { error: "Informe o nome da secretaria." };
  }

  if (!slug) {
    return { error: "Informe o identificador da secretaria." };
  }

  if (!description) {
    return { error: "Informe uma descrição para a secretaria." };
  }

  return {
    value: {
      name,
      slug,
      description,
      phone: form.phone.trim() || undefined,
      isActive: form.isActive,
    },
  };
}

function buildDetailedInfoPayload(form: ServiceFormState): DetailedServiceInfo | undefined {
  const payload: DetailedServiceInfo = {
    oQueE: form.oQueE.trim() || undefined,
    paraQueServe: form.paraQueServe.trim() || undefined,
    quemPodeSolicitar: form.quemPodeSolicitar.trim() || undefined,
    informacoesComplementares: form.informacoesComplementares.trim() || undefined,
    informacoesNecessarias: toOptionalStringArray(form.informacoesNecessarias),
    tempoAtendimento: form.tempoAtendimento.trim() || undefined,
    legislacao: toOptionalStringArray(form.legislacao),
  };

  return Object.values(payload).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  )
    ? payload
    : undefined;
}

function buildServicePayload(form: ServiceFormState) {
  const slaHours = toOptionalNumber(form.slaHours);
  const order = toOptionalNumber(form.order);
  const fields = buildServiceFieldsPayload(form);

  if (Number.isNaN(slaHours)) {
    return { error: "O SLA precisa ser informado em horas com um número válido." };
  }

  if (Number.isNaN(order)) {
    return { error: "A ordem do serviço precisa ser um número válido." };
  }

  if (fields.error) {
    return { error: fields.error };
  }

  return {
    value: {
      name: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: form.categoryId,
      description: form.description.trim(),
      slaHours,
      slaPriority: form.slaPriority,
      requiresAuth: form.requiresAuth,
      isActive: form.isActive,
      order,
      detailedInfo: buildDetailedInfoPayload(form),
      fields: fields.value,
    },
  };
}

function formatSlaHours(value?: number) {
  if (typeof value !== "number") return "—";
  if (value <= 24) return `${value}h`;
  return `${Math.round(value / 24)} dias`;
}

function CategorySectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function ServicesAdminClient() {
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [editorTab, setEditorTab] = useState<"department" | "category" | "service">("department");
  const [departmentMode, setDepartmentMode] = useState<"create" | "edit">("create");
  const [categoryMode, setCategoryMode] = useState<"create" | "edit">("create");
  const [serviceMode, setServiceMode] = useState<"create" | "edit">("create");
  const [departmentForm, setDepartmentForm] = useState<DepartmentFormState>(createEmptyDepartmentForm());
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(createEmptyCategoryForm());
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(createEmptyServiceForm());
  const [departmentSubmitting, setDepartmentSubmitting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
  const [busyServiceId, setBusyServiceId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);

    try {
      const [servicesResponse, categoriesResponse, departmentsResponse] = await Promise.all([
        apiGet<ApiEnvelope<AdminServiceItem[]>>("/api/v1/admin/services", { auth: true }),
        apiGet<ApiEnvelope<AdminCategoryItem[]>>("/api/v1/catalog/categories"),
        apiGet<ApiEnvelope<DepartmentSummary[]>>("/api/v1/admin/departments", { auth: true }),
      ]);

      const nextServices = (servicesResponse.data || []).slice().sort((left, right) => {
        const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return left.name.localeCompare(right.name, "pt-BR");
      });

      const nextCategories = (categoriesResponse.data || []).slice().sort((left, right) => {
        const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return left.name.localeCompare(right.name, "pt-BR");
      });

      setServices(nextServices);
      setCategories(nextCategories);
      setDepartments((departmentsResponse.data || []).slice().sort((left, right) => left.name.localeCompare(right.name, "pt-BR")));
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    if (!serviceForm.categoryId && categories.length > 0 && serviceMode === "create") {
      setServiceForm((current) => ({
        ...current,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, serviceForm.categoryId, serviceMode]);

  const departmentNameById = new Map(departments.map((department) => [department.id, department.name]));
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  const servicesByCategoryId = services.reduce<Record<string, number>>((accumulator, service) => {
    accumulator[service.categoryId] = (accumulator[service.categoryId] || 0) + 1;
    return accumulator;
  }, {});

  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredDepartments = departments.filter((department) => {
    if (!normalizedSearch) return true;

    return [
      department.name,
      department.slug,
      department.description || "",
      department.email || "",
      department.phone || "",
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const filteredCategories = categories.filter((category) => {
    if (!normalizedSearch) return true;

    const departmentName = category.departmentId
      ? departmentNameById.get(category.departmentId) || category.departmentId
      : "";

    return [category.name, category.slug, category.description || "", category.icon || "", departmentName]
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const filteredServices = services.filter((service) => {
    if (!normalizedSearch) return true;

    const categoryName = categoryNameById.get(service.categoryId) || service.category?.name || "";

    return [
      service.name,
      service.slug,
      service.description || "",
      categoryName,
      service.slaPriority || "",
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  function resetCategoryForm() {
    setEditorTab("category");
    setCategoryMode("create");
    setCategoryForm(createEmptyCategoryForm());
  }

  function resetServiceForm() {
    setEditorTab("service");
    setServiceMode("create");
    setServiceForm(createEmptyServiceForm(categories[0]?.id || ""));
  }

  function resetDepartmentForm() {
    setEditorTab("department");
    setDepartmentMode("create");
    setDepartmentForm(createEmptyDepartmentForm());
  }

  function handleEditDepartment(department: DepartmentSummary) {
    setFeedback(null);
    setEditorTab("department");
    setDepartmentMode("edit");
    setDepartmentForm({
      id: department.id,
      name: department.name,
      slug: department.slug,
      description: department.description || "",
      phone: department.phone || "",
      isActive: department.isActive,
    });
  }

  function handleEditCategory(category: AdminCategoryItem) {
    setFeedback(null);
    setEditorTab("category");
    setCategoryMode("edit");
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon || "FolderOpen",
      description: category.description || "",
      order: typeof category.order === "number" ? String(category.order) : "",
      departmentId: category.departmentId || "",
    });
  }

  function handleEditService(service: AdminServiceItem) {
    setFeedback(null);
    setEditorTab("service");
    setServiceMode("edit");
    setServiceForm({
      id: service.id,
      name: service.name,
      slug: service.slug,
      categoryId: service.categoryId,
      description: service.description || "",
      slaHours: typeof service.slaHours === "number" ? String(service.slaHours) : "",
      slaPriority: service.slaPriority || "NORMAL",
      requiresAuth: Boolean(service.requiresAuth),
      isActive: service.isActive !== false,
      order: typeof service.order === "number" ? String(service.order) : "",
      oQueE: service.detailedInfo?.oQueE || "",
      paraQueServe: service.detailedInfo?.paraQueServe || "",
      quemPodeSolicitar: service.detailedInfo?.quemPodeSolicitar || "",
      informacoesComplementares: service.detailedInfo?.informacoesComplementares || "",
      informacoesNecessarias: service.detailedInfo?.informacoesNecessarias?.join("\n") || "",
      tempoAtendimento: service.detailedInfo?.tempoAtendimento || "",
      legislacao: service.detailedInfo?.legislacao?.join("\n") || "",
      ...(() => {
        const { supportedFields, preservedFields } = getBuilderFieldsFromService(service.fields);
        return {
          fields: supportedFields,
          preservedFields,
        };
      })(),
    });
  }

  async function handleDepartmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = buildDepartmentPayload(departmentForm);
    if (payload.error) {
      setFeedback({ type: "error", message: payload.error });
      return;
    }

    setDepartmentSubmitting(true);

    try {
      if (departmentMode === "edit" && departmentForm.id) {
        await apiPatch<DepartmentSummary>(
          `/api/v1/admin/departments/${departmentForm.id}`,
          payload.value,
          { auth: true }
        );
        setFeedback({ type: "success", message: "Secretaria atualizada com sucesso." });
      } else {
        await apiPost<DepartmentSummary>("/api/v1/admin/departments", payload.value, {
          auth: true,
        });
        setFeedback({ type: "success", message: "Secretaria criada com sucesso." });
      }

      resetDepartmentForm();
      await fetchCatalog();
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDepartmentSubmitting(false);
    }
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = buildCategoryPayload(categoryForm);
    if (payload.error) {
      setFeedback({ type: "error", message: payload.error });
      return;
    }

    setCategorySubmitting(true);

    try {
      if (categoryMode === "edit" && categoryForm.id) {
        await apiPatch<ApiEnvelope<AdminCategoryItem>>(
          `/api/v1/admin/categories/${categoryForm.id}`,
          payload.value,
          { auth: true }
        );
        setFeedback({ type: "success", message: "Categoria atualizada com sucesso." });
      } else {
        await apiPost<ApiEnvelope<AdminCategoryItem>>("/api/v1/admin/categories", payload.value, {
          auth: true,
        });
        setFeedback({ type: "success", message: "Categoria criada com sucesso." });
      }

      resetCategoryForm();
      await fetchCatalog();
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setCategorySubmitting(false);
    }
  }

  async function handleServiceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const payload = buildServicePayload(serviceForm);
    if (payload.error) {
      setFeedback({ type: "error", message: payload.error });
      return;
    }

    setServiceSubmitting(true);

    try {
      if (serviceMode === "edit" && serviceForm.id) {
        await apiPatch<ApiEnvelope<AdminServiceItem>>(
          `/api/v1/admin/services/${serviceForm.id}`,
          payload.value,
          { auth: true }
        );
        setFeedback({ type: "success", message: "Serviço atualizado com sucesso." });
      } else {
        await apiPost<ApiEnvelope<AdminServiceItem>>("/api/v1/admin/services", payload.value, {
          auth: true,
        });
        setFeedback({ type: "success", message: "Serviço criado com sucesso." });
      }

      resetServiceForm();
      await fetchCatalog();
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setServiceSubmitting(false);
    }
  }

  async function handleDeleteCategory(category: AdminCategoryItem) {
    const confirmed = window.confirm(
      `Deseja excluir a categoria "${category.name}"?`
    );

    if (!confirmed) return;

    setFeedback(null);
    setBusyCategoryId(category.id);

    try {
      await apiDelete<ApiEnvelope<AdminCategoryItem>>(`/api/v1/admin/categories/${category.id}`, undefined, {
        auth: true,
      });
      if (categoryForm.id === category.id) {
        resetCategoryForm();
      }
      setFeedback({ type: "success", message: "Categoria removida com sucesso." });
      await fetchCatalog();
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setBusyCategoryId(null);
    }
  }

  async function handleToggleServiceStatus(service: AdminServiceItem) {
    const nextIsActive = service.isActive === false;
    const confirmed = window.confirm(
      nextIsActive
        ? `Deseja reativar o serviço "${service.name}"?`
        : `Deseja inativar o serviço "${service.name}"?`
    );

    if (!confirmed) return;

    setFeedback(null);
    setBusyServiceId(service.id);

    try {
      await apiPatch<ApiEnvelope<AdminServiceItem>>(
        `/api/v1/admin/services/${service.id}`,
        { isActive: nextIsActive },
        { auth: true }
      );
      if (serviceForm.id === service.id && !nextIsActive) {
        setServiceForm((current) => ({ ...current, isActive: false }));
      }
      setFeedback({
        type: "success",
        message: nextIsActive ? "Serviço reativado com sucesso." : "Serviço inativado com sucesso.",
      });
      await fetchCatalog();
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setBusyServiceId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo e secretarias</h1>
          <p className="mt-1 text-sm text-gray-500">
            {departments.length} secretarias, {categories.length} categorias e {services.length} serviços organizados no backoffice
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Building2 size={16} />}
            onClick={resetDepartmentForm}
          >
            Nova secretaria
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={resetCategoryForm}
          >
            Nova categoria
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Wrench size={16} />}
            onClick={resetServiceForm}
          >
            Novo serviço
          </Button>
          <button
            type="button"
            onClick={fetchCatalog}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Atualizar catálogo"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
          <p className="text-sm font-medium text-violet-700">Secretarias</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{departments.length}</p>
          <p className="mt-1 text-sm text-gray-500">Cadastre as áreas responsáveis antes de vincular categorias.</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
          <p className="text-sm font-medium text-blue-700">Categorias</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{categories.length}</p>
          <p className="mt-1 text-sm text-gray-500">Vincule secretarias e organize a navegação pública.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
          <p className="text-sm font-medium text-emerald-700">Serviços</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{services.length}</p>
          <p className="mt-1 text-sm text-gray-500">Cadastre SLA, autenticação e conteúdo detalhado do atendimento.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              editorTab === "department"
                ? "Buscar por secretaria, slug ou telefone..."
                : editorTab === "category"
                  ? "Buscar por categoria, secretaria ou slug..."
                  : "Buscar por serviço, categoria, prioridade ou slug..."
            }
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          <RefreshCw size={24} className="mx-auto mb-3 animate-spin" />
          Carregando catálogo administrativo...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <CategorySectionHeader
                title="Secretarias"
                description="Gerencie as áreas responsáveis usadas nas categorias e no acompanhamento operacional."
              />

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {filteredDepartments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 md:col-span-2">
                    Nenhuma secretaria encontrada com os filtros atuais.
                  </div>
                ) : (
                  filteredDepartments.map((department) => (
                    <div
                      key={department.id}
                      className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-violet-200 hover:bg-violet-50/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                              <Building2 size={18} />
                            </span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{department.name}</h3>
                              <p className="text-xs font-medium text-gray-500">{department.slug}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {department.description || "Sem descrição cadastrada."}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                              {department.phone || "Sem telefone"}
                            </span>
                            <span className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-700">
                              {department._count.categories} categoria{department._count.categories === 1 ? "" : "s"}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                              {department._count.requests} solicitaç{department._count.requests === 1 ? "ão" : "ões"}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 font-medium ${
                                department.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {department.isActive ? "Ativa" : "Inativa"}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          leftIcon={<Pencil size={15} />}
                          onClick={() => handleEditDepartment(department)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <CategorySectionHeader
                title="Categorias"
                description="Crie, ajuste e desative categorias que organizam os serviços do portal."
              />

              <div className="mt-5 space-y-3">
                {filteredCategories.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    Nenhuma categoria encontrada com os filtros atuais.
                  </div>
                ) : (
                  filteredCategories.map((category) => {
                    const departmentName = category.departmentId
                      ? departmentNameById.get(category.departmentId) || category.departmentId
                      : "Sem secretaria";
                    const CategoryIcon = getCategoryIcon(category.icon || "FolderOpen");

                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <CategoryIcon size={18} />
                              </span>
                              <div>
                                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                <p className="text-xs font-medium text-gray-500">{category.slug}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {category.description || "Sem descrição cadastrada."}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                                <CategoryIcon size={12} />
                                {category.icon || "FolderOpen"}
                              </span>
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                                Ordem: {typeof category.order === "number" ? category.order : "—"}
                              </span>
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                                Secretaria: {departmentName}
                              </span>
                              <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                                {servicesByCategoryId[category.id] || 0} serviço{servicesByCategoryId[category.id] === 1 ? "" : "s"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              leftIcon={<Pencil size={15} />}
                              onClick={() => handleEditCategory(category)}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              isLoading={busyCategoryId === category.id}
                              leftIcon={<Trash2 size={15} />}
                              onClick={() => handleDeleteCategory(category)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <CategorySectionHeader
                title="Serviços"
                description="Gerencie descrição, categoria, SLA e ativação dos serviços exibidos no admin."
              />

              <div className="mt-5 overflow-x-auto">
                {filteredServices.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    Nenhum serviço encontrado com os filtros atuais.
                  </div>
                ) : (
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-4 py-3 font-medium">Serviço</th>
                        <th className="px-4 py-3 font-medium">Categoria</th>
                        <th className="px-4 py-3 font-medium">Prioridade</th>
                        <th className="px-4 py-3 font-medium">SLA</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredServices.map((service) => {
                        const categoryName =
                          categoryNameById.get(service.categoryId) || service.category?.name || service.categoryId;

                        return (
                          <tr key={service.id} className="align-top">
                            <td className="px-4 py-4">
                              <p className="font-medium text-gray-900">{service.name}</p>
                              <p className="mt-1 text-xs font-medium text-gray-500">{service.slug}</p>
                              <p className="mt-2 max-w-md text-xs text-gray-600">
                                {service.description || "Sem descrição cadastrada."}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-xs text-gray-600">{categoryName}</td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                  PRIORITY_COLORS[service.slaPriority || "NORMAL"]
                                }`}
                              >
                                {PRIORITY_LABELS[service.slaPriority || "NORMAL"]}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                                <Clock3 size={14} />
                                {formatSlaHours(service.slaHours)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-2">
                                <span
                                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                                    service.isActive !== false
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {service.isActive !== false ? "Ativo" : "Inativo"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {service.requiresAuth ? "Exige autenticação" : "Acesso público"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<Pencil size={15} />}
                                  onClick={() => handleEditService(service)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  variant={service.isActive !== false ? "danger" : "outline"}
                                  size="sm"
                                  isLoading={busyServiceId === service.id}
                                  leftIcon={service.isActive !== false ? <Trash2 size={15} /> : <RefreshCw size={15} />}
                                  onClick={() => handleToggleServiceStatus(service)}
                                >
                                  {service.isActive !== false ? "Inativar" : "Reativar"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-50 p-2">
                {[
                  { key: "department", label: "Secretarias", icon: <Building2 size={15} /> },
                  { key: "category", label: "Categorias", icon: <Plus size={15} /> },
                  { key: "service", label: "Serviços", icon: <Wrench size={15} /> },
                ].map((tab) => {
                  const isActive = editorTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setEditorTab(tab.key as "department" | "category" | "service")}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:bg-white/70 hover:text-gray-700"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {editorTab === "department" && (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <CategorySectionHeader
                  title={departmentMode === "edit" ? "Editar secretaria" : "Nova secretaria"}
                  description="Cadastre a estrutura responsável e mantenha o vínculo com categorias sempre disponível."
                />

                <form className="mt-5 space-y-4" onSubmit={handleDepartmentSubmit}>
                  <Input
                    label="Nome"
                    name="department-name"
                    value={departmentForm.name}
                    onChange={(event) =>
                      setDepartmentForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Ex.: Secretaria Municipal de Saúde"
                    required
                  />
                  <Input
                    label="Slug"
                    name="department-slug"
                    value={departmentForm.slug}
                    onChange={(event) =>
                      setDepartmentForm((current) => ({ ...current, slug: event.target.value }))
                    }
                    placeholder="semus"
                    required
                  />
                  <Input
                    label="Telefone"
                    name="department-phone"
                    value={departmentForm.phone}
                    onChange={(event) =>
                      setDepartmentForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="(21) 99999-9999"
                  />
                  <div>
                    <label
                      htmlFor="department-description"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Descrição
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <textarea
                      id="department-description"
                      value={departmentForm.description}
                      onChange={(event) =>
                        setDepartmentForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Responsabilidade e escopo operacional dessa secretaria."
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={departmentForm.isActive}
                      onChange={(event) =>
                        setDepartmentForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                    />
                    Manter secretaria ativa
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={departmentSubmitting}
                      leftIcon={<Save size={15} />}
                    >
                      {departmentMode === "edit" ? "Salvar secretaria" : "Criar secretaria"}
                    </Button>
                    {departmentMode === "edit" && (
                      <Button type="button" variant="ghost" size="sm" onClick={resetDepartmentForm}>
                        Cancelar edição
                      </Button>
                    )}
                  </div>
                </form>
              </section>
            )}

            {editorTab === "category" && (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <CategorySectionHeader
                title={categoryMode === "edit" ? "Editar categoria" : "Nova categoria"}
                description="As categorias alimentam o catálogo público e a organização do admin."
              />

              <form className="mt-5 space-y-4" onSubmit={handleCategorySubmit}>
                <Input
                  label="Nome"
                  name="category-name"
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex.: Iluminação Pública"
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Slug"
                    name="category-slug"
                    value={categoryForm.slug}
                    onChange={(event) =>
                      setCategoryForm((current) => ({ ...current, slug: event.target.value }))
                    }
                    placeholder="iluminacao-publica"
                    required
                  />
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        {(() => {
                          const SelectedIcon = getCategoryIcon(categoryForm.icon || "FolderOpen");
                          return <SelectedIcon size={20} />;
                        })()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ícone selecionado</p>
                        <p className="text-xs text-gray-500">{categoryForm.icon || "FolderOpen"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Escolha o ícone da categoria
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 sm:grid-cols-3">
                    {CATEGORY_ICON_OPTIONS.map((iconName) => {
                      const Icon = categoryIconMap[iconName];
                      const isSelected = categoryForm.icon === iconName;

                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            setCategoryForm((current) => ({
                              ...current,
                              icon: iconName,
                            }))
                          }
                          className={`rounded-xl border px-3 py-3 text-left transition ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/40"
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-current/10">
                            <Icon size={18} />
                          </span>
                          <span className="block text-xs font-medium">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    {departments.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
                        <p>Cadastre uma secretaria para vincular esta categoria à área responsável.</p>
                        <button
                          type="button"
                          onClick={resetDepartmentForm}
                          className="mt-2 text-sm font-medium underline"
                        >
                          Criar secretaria agora
                        </button>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="category-department"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Secretaria
                        </label>
                        <select
                          id="category-department"
                          value={categoryForm.departmentId}
                          onChange={(event) =>
                            setCategoryForm((current) => ({
                              ...current,
                              departmentId: event.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Sem vínculo</option>
                          {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                  <Input
                    label="Ordem"
                    name="category-order"
                    type="number"
                    min="0"
                    value={categoryForm.order}
                    onChange={(event) =>
                      setCategoryForm((current) => ({ ...current, order: event.target.value }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category-description"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(event) =>
                      setCategoryForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Resumo visível para o cidadão e para a equipe administrativa."
                    rows={4}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={categorySubmitting}
                    leftIcon={<Save size={15} />}
                  >
                    {categoryMode === "edit" ? "Salvar categoria" : "Criar categoria"}
                  </Button>
                  {categoryMode === "edit" && (
                    <Button type="button" variant="ghost" size="sm" onClick={resetCategoryForm}>
                      Cancelar edição
                    </Button>
                  )}
                </div>
              </form>
            </section>
            )}

            {editorTab === "service" && (
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <CategorySectionHeader
                title={serviceMode === "edit" ? "Editar serviço" : "Novo serviço"}
                description="Preencha as informações do serviço e organize o formulário de atendimento."
              />

              <form className="mt-5 space-y-4" onSubmit={handleServiceSubmit}>
                {categories.length === 0 && (
                  <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <p>Cadastre uma categoria antes de criar serviços.</p>
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="mt-2 text-sm font-medium underline"
                    >
                      Criar categoria agora
                    </button>
                  </div>
                )}
                <Input
                  label="Nome"
                  name="service-name"
                  value={serviceForm.name}
                  onChange={(event) =>
                    setServiceForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex.: Lâmpada apagada"
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Slug"
                    name="service-slug"
                    value={serviceForm.slug}
                    onChange={(event) =>
                      setServiceForm((current) => ({ ...current, slug: event.target.value }))
                    }
                    placeholder="lampada-apagada"
                    required
                  />
                  <div>
                    <label
                      htmlFor="service-category"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Categoria
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      id="service-category"
                      value={serviceForm.categoryId}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, categoryId: event.target.value }))
                      }
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service-description"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Descrição
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    id="service-description"
                    value={serviceForm.description}
                    onChange={(event) =>
                      setServiceForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Resumo operacional do serviço."
                    rows={4}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="service-priority"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Prioridade
                    </label>
                    <select
                      id="service-priority"
                      value={serviceForm.slaPriority}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          slaPriority: event.target.value as SlaPriority,
                        }))
                      }
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {PRIORITY_OPTIONS.map((priority) => (
                        <option key={priority} value={priority}>
                          {PRIORITY_LABELS[priority]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="SLA (horas)"
                    name="service-sla"
                    type="number"
                    min="0"
                    value={serviceForm.slaHours}
                    onChange={(event) =>
                      setServiceForm((current) => ({ ...current, slaHours: event.target.value }))
                    }
                    placeholder="72"
                  />
                  <Input
                    label="Ordem"
                    name="service-order"
                    type="number"
                    min="0"
                    value={serviceForm.order}
                    onChange={(event) =>
                      setServiceForm((current) => ({ ...current, order: event.target.value }))
                    }
                    placeholder="0"
                  />
                </div>

                <div className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={serviceForm.requiresAuth}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          requiresAuth: event.target.checked,
                        }))
                      }
                    />
                    Exigir autenticação para solicitar
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={serviceForm.isActive}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                    />
                    Manter serviço ativo no catálogo administrativo
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="service-oqee"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      O que é
                    </label>
                    <textarea
                      id="service-oqee"
                      value={serviceForm.oQueE}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, oQueE: event.target.value }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-para-que-serve"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Para que serve
                    </label>
                    <textarea
                      id="service-para-que-serve"
                      value={serviceForm.paraQueServe}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          paraQueServe: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-quem-pode"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Quem pode solicitar
                    </label>
                    <textarea
                      id="service-quem-pode"
                      value={serviceForm.quemPodeSolicitar}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          quemPodeSolicitar: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-tempo"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Tempo de atendimento
                    </label>
                    <textarea
                      id="service-tempo"
                      value={serviceForm.tempoAtendimento}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          tempoAtendimento: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service-extra-info"
                    className="mb-1.5 block text-sm font-medium text-neutral-700"
                  >
                    Informações complementares
                  </label>
                  <textarea
                    id="service-extra-info"
                    value={serviceForm.informacoesComplementares}
                    onChange={(event) =>
                      setServiceForm((current) => ({
                        ...current,
                        informacoesComplementares: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="service-info-needed"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Informações necessárias
                    </label>
                    <textarea
                      id="service-info-needed"
                      value={serviceForm.informacoesNecessarias}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          informacoesNecessarias: event.target.value,
                        }))
                      }
                      placeholder="Um item por linha"
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-legislation"
                      className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                      Legislação
                    </label>
                    <textarea
                      id="service-legislation"
                      value={serviceForm.legislacao}
                      onChange={(event) =>
                        setServiceForm((current) => ({
                          ...current,
                          legislacao: event.target.value,
                        }))
                      }
                      placeholder="Uma referência por linha"
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <FieldBuilderSection serviceForm={serviceForm} setServiceForm={setServiceForm} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={serviceSubmitting}
                    leftIcon={<Save size={15} />}
                  >
                    {serviceMode === "edit" ? "Salvar serviço" : "Criar serviço"}
                  </Button>
                  {serviceMode === "edit" && (
                    <Button type="button" variant="ghost" size="sm" onClick={resetServiceForm}>
                      Cancelar edição
                    </Button>
                  )}
                </div>
              </form>
            </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldBuilderSection({
  serviceForm,
  setServiceForm,
}: {
  serviceForm: ServiceFormState;
  setServiceForm: Dispatch<SetStateAction<ServiceFormState>>;
}) {
  const updateField = (index: number, changes: Partial<BuilderField>) => {
    setServiceForm((current) => ({
      ...current,
      fields: current.fields.map((field, fieldIndex) => {
        if (fieldIndex !== index) return field;

        const nextType = changes.type ?? field.type;
        const nextOptions =
          nextType === "select"
            ? changes.options ?? (field.type === "select" ? field.options : [{ value: "", label: "" }])
            : [];

        return {
          ...field,
          ...changes,
          type: nextType,
          options: nextOptions,
        };
      }),
    }));
  };

  const addField = () => {
    setServiceForm((current) => ({
      ...current,
      fields: [...current.fields, createEmptyBuilderField()],
    }));
  };

  const removeField = (index: number) => {
    setServiceForm((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    setServiceForm((current) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.fields.length) return current;

      const nextFields = [...current.fields];
      const [field] = nextFields.splice(index, 1);
      nextFields.splice(targetIndex, 0, field);

      return {
        ...current,
        fields: nextFields,
      };
    });
  };

  const addOption = (fieldIndex: number) => {
    updateField(fieldIndex, {
      options: [...serviceForm.fields[fieldIndex].options, { value: "", label: "" }],
    });
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    key: keyof BuilderFieldOption,
    value: string
  ) => {
    updateField(fieldIndex, {
      options: serviceForm.fields[fieldIndex].options.map((option, currentIndex) =>
        currentIndex === optionIndex ? { ...option, [key]: value } : option
      ),
    });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    updateField(fieldIndex, {
      options: serviceForm.fields[fieldIndex].options.filter((_, currentIndex) => currentIndex !== optionIndex),
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Campos do atendimento</h3>
          <p className="mt-1 text-sm text-gray-500">
            Monte aqui os dados que a equipe precisa receber quando esse serviço for usado.
          </p>
          {serviceForm.preservedFields.length > 0 && (
            <p className="mt-2 text-xs text-amber-700">
              Alguns campos especiais já cadastrados serão mantidos automaticamente ao salvar.
            </p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" leftIcon={<Plus size={15} />} onClick={addField}>
          Adicionar campo
        </Button>
      </div>

      {serviceForm.fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
          Nenhum campo extra configurado para este serviço.
        </div>
      ) : (
        <div className="space-y-4">
          {serviceForm.fields.map((field, index) => (
            <div key={`${field.id || "novo"}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Campo {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    Defina o nome exibido, o código interno e o tipo de preenchimento.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowUp size={14} />}
                    onClick={() => moveField(index, "up")}
                    disabled={index === 0}
                  >
                    Subir
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowDown size={14} />}
                    onClick={() => moveField(index, "down")}
                    disabled={index === serviceForm.fields.length - 1}
                  >
                    Descer
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => removeField(index)}
                  >
                    Remover
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome exibido"
                  value={field.label}
                  onChange={(event) => updateField(index, { label: event.target.value })}
                  placeholder="Ex.: Descrição do problema"
                />
                <Input
                  label="Código do campo"
                  value={field.id}
                  onChange={(event) => updateField(index, { id: event.target.value })}
                  placeholder="descricao_problema"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tipo</label>
                  <select
                    value={field.type}
                    onChange={(event) =>
                      updateField(index, { type: event.target.value as SupportedServiceFieldType })
                    }
                    className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-neutral-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {SUPPORTED_FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {FIELD_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Texto de apoio"
                  value={field.placeholder}
                  onChange={(event) => updateField(index, { placeholder: event.target.value })}
                  placeholder="Ex.: Conte o máximo de detalhes possível"
                />
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) => updateField(index, { required: event.target.checked })}
                />
                Campo obrigatório
              </label>

              {field.type === "select" && (
                <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Opções de escolha</p>
                      <p className="text-xs text-gray-500">Informe o texto exibido e o valor salvo para cada opção.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={() => addOption(index)}>
                      Adicionar opção
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {field.options.map((option, optionIndex) => (
                      <div key={`${optionIndex}-${option.value}-${option.label}`} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <Input
                          label="Texto exibido"
                          value={option.label}
                          onChange={(event) => updateOption(index, optionIndex, "label", event.target.value)}
                          placeholder="Ex.: Urgente"
                        />
                        <Input
                          label="Valor salvo"
                          value={option.value}
                          onChange={(event) => updateOption(index, optionIndex, "value", event.target.value)}
                          placeholder="urgente"
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            leftIcon={<Trash2 size={14} />}
                            onClick={() => removeOption(index, optionIndex)}
                            disabled={field.options.length === 1}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const FIELD_TYPE_LABELS: Record<SupportedServiceFieldType, string> = {
  text: "Texto curto",
  textarea: "Texto longo",
  select: "Lista de opções",
  date: "Data",
  email: "E-mail",
  phone: "Telefone",
  cpf: "CPF",
};
