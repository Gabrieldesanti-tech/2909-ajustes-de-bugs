// =============================================================================
// Portal 2909 - Tipos alinhados ao contrato da API
// =============================================================================

export type UserRole = "CITIZEN" | "ATTENDANT" | "ANALYST" | "MANAGER" | "ADMIN";
export type SlaPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type RequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "WAITING_INFO"
  | "FORWARDED"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED"
  | "REOPENED";
export type RequestOrigin =
  | "WEB"
  | "APP"
  | "PORTAL"
  | "PHONE"
  | "IN_PERSON"
  | "WHATSAPP"
  | "EMAIL"
  | "IMPORT";
export type AuditAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "STATUS_CHANGE"
  | "ASSIGNMENT"
  | "COMMENT"
  | "LINK";
export type NotificationType =
  | "STATUS_UPDATE"
  | "NEW_COMMENT"
  | "SLA_WARNING"
  | "SLA_BREACH"
  | "SYSTEM";

// =============================================================================
// Tipos base de API
// =============================================================================

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiPaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// Acessibilidade
// =============================================================================

export type FontSize = "normal" | "large" | "larger";
export type ContrastMode = "normal" | "high";

export interface AccessibilitySettings {
  fontSize: FontSize;
  contrastMode: ContrastMode;
}

// =============================================================================
// Usuário e autenticação
// =============================================================================

export interface Address {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  role: UserRole;
  phizUserId: string | null;
}

export interface AuthTokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: AuthUser;
}

export interface AuthMeData {
  user: AuthUser;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  isActive: boolean;
  phone?: string | null;
  createdAt?: string;
}

// =============================================================================
// Catálogo
// =============================================================================

export interface ServiceFieldOption {
  value: string;
  label: string;
}

export interface ServiceFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface ServiceField {
  id: string;
  name?: string;
  label?: string;
  type: "text" | "textarea" | "select" | "file" | "date" | "cpf" | "phone" | "email" | "address" | string;
  required: boolean;
  placeholder?: string;
  options?: ServiceFieldOption[];
  validation?: ServiceFieldValidation;
}

export interface DetailedServiceInfo {
  oQueE?: string;
  paraQueServe?: string;
  quemPodeSolicitar?: string;
  informacoesComplementares?: string;
  informacoesNecessarias?: string[];
  tempoAtendimento?: string;
  legislacao?: string[];
}

export interface CatalogServiceSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CatalogCategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  departmentId?: string | null;
  services: CatalogServiceSummary[];
}

export interface AdminCategoryItem extends CatalogCategorySummary {
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogServiceListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  slaHours?: number;
  slaPriority?: SlaPriority;
  requiresAuth?: boolean;
  isActive?: boolean;
}

export interface CatalogServiceDetail extends CatalogServiceListItem {
  detailedInfo?: DetailedServiceInfo | null;
  fields?: ServiceField[];
  category?: {
    id: string;
    slug: string;
    name: string;
  };
}

export interface AdminServiceItem extends CatalogServiceDetail {
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// Conteúdo
// =============================================================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string | null;
  order: number;
  isActive: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  author: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface PublicPageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
  updatedBy: string | null;
}

// =============================================================================
// Solicitações
// =============================================================================

export interface RequestHistoryItem {
  id: string;
  fromStatus?: RequestStatus | null;
  toStatus?: RequestStatus | null;
  message?: string;
  isPublic?: boolean;
  userId?: string | null;
  userName?: string | null;
  createdAt: string;
}

export interface RequestComment {
  id: string;
  requestId: string;
  userId?: string | null;
  content: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: {
    name: string;
  } | null;
}

export interface RequestAttachment {
  id: string;
  requestId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt?: string;
}

export interface RequestServiceRef {
  id?: string;
  name: string;
  category?: {
    name: string;
  };
}

export interface AdminRequestListItem {
  id: string;
  protocol: string;
  userId?: string | null;
  isAnonymous?: boolean;
  serviceId?: string;
  description: string;
  status: RequestStatus;
  origin: RequestOrigin | string;
  departmentId?: string | null;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  slaDeadline?: string;
  slaBreached?: boolean;
  service?: RequestServiceRef;
  address?: {
    neighborhood?: string;
  } | null;
  user?: {
    name: string;
    email?: string;
  } | null;
  assignee?: {
    name: string;
  } | null;
  department?: {
    name: string;
  } | null;
  _count?: {
    attachments?: number;
    comments?: number;
  };
}

export interface RequestPublicDetail {
  id: string;
  protocol: string;
  description: string;
  status: RequestStatus;
  origin: RequestOrigin | string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  slaDeadline: string;
  slaBreached: boolean;
  service: {
    id: string;
    name: string;
  };
  history: RequestHistoryItem[];
  comments: RequestComment[];
}

export interface RequestAdminDetail extends RequestPublicDetail {
  userId?: string | null;
  isAnonymous?: boolean;
  serviceId?: string;
  departmentId?: string | null;
  assigneeId?: string | null;
  address?: Address | null;
  attachments?: RequestAttachment[];
  user?: {
    name: string;
    email: string;
  } | null;
  assignee?: {
    name: string;
  } | null;
  department?: {
    name: string;
  } | null;
  service: RequestServiceRef & {
    id: string;
    name: string;
  };
}

export interface RequestProtocolResponse {
  protocol: string;
}

// =============================================================================
// Dashboard
// =============================================================================

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  closedRequests: number;
  cancelledRequests: number;
  slaBreached: number;
  avgResolutionHours: number;
  todayRequests: number;
  weekRequests: number;
  monthRequests: number;
  totalUsers: number;
  totalServices: number;
  totalDepartments: number;
}

export interface RequestsByStatusChart {
  status: RequestStatus | string;
  count: number;
  statusLabel?: string;
  color?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: {
    byStatus: RequestsByStatusChart[];
    byPeriod: Array<{ period: string; count: number }>;
    byCategory: Array<{ category?: string; service?: string; count: number }>;
    byNeighborhood: Array<{ neighborhood: string; count: number }>;
  };
}

export interface PublicStatsData {
  totalRequests: number;
  totalServices: number;
  totalUsers: number;
  byStatus: Array<{ status: RequestStatus | string; count: number }>;
}

// =============================================================================
// Departamentos / secretarias
// =============================================================================

export interface DepartmentSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  _count: {
    requests: number;
    categories: number;
  };
}

export interface DepartmentDetail extends DepartmentSummary {
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    services?: CatalogServiceSummary[];
  }>;
  stats: {
    total: number;
    byStatus: Partial<Record<RequestStatus, number>>;
  };
}

// =============================================================================
// Auditoria e notificações
// =============================================================================

export interface AuditLogItem {
  id: string;
  userId: string | null;
  action: AuditAction | string;
  entity: string;
  entityId: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  correlationId?: string | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string | null;
  type: NotificationType | string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCountData {
  unread: number;
  total: number;
}

export interface PhizQrCodeData {
  qrcodeUrl: string;
  scanToken: string;
  expireTime: number;
}

export interface PhizScanStatusResponse {
  status: "PENDING" | "COMPLETED" | "EXPIRED" | string;
  phizUserId?: string;
}

// =============================================================================
// Filtros
// =============================================================================

export interface RequestFilters {
  status?: RequestStatus | string;
  serviceId?: string;
  categoryId?: string;
  neighborhood?: string;
  origin?: RequestOrigin | string;
  dateFrom?: string;
  dateTo?: string;
  slaBreached?: boolean;
  assigneeId?: string;
  departmentId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
