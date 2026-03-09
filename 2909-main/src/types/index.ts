// =============================================================================
// Portal 2909 - Tipos do Sistema
// =============================================================================

// Tipos de Role, Status, etc. como strings (compatível SQLite e PostgreSQL)
export type UserRole = "CITIZEN" | "ATTENDANT" | "ANALYST" | "MANAGER" | "ADMIN";
export type SlaPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type RequestStatus = "PENDING" | "IN_PROGRESS" | "WAITING_INFO" | "FORWARDED" | "RESOLVED" | "CLOSED" | "CANCELLED" | "REOPENED";
export type RequestOrigin = "PORTAL" | "APP" | "PHONE" | "IN_PERSON" | "WHATSAPP" | "EMAIL" | "IMPORT";
export type AuditAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "STATUS_CHANGE" | "ASSIGNMENT" | "COMMENT";
export type NotificationType = "STATUS_UPDATE" | "NEW_COMMENT" | "SLA_WARNING" | "SLA_BREACH" | "SYSTEM";

// =============================================================================
// Tipos para Categorias e Serviços
// =============================================================================

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
  description?: string;
  services: Service[];
}

export interface DetailedServiceInfo {
  oQueE: string;
  paraQueServe: string;
  quemPodeSolicitar: string;
  informacoesComplementares?: string;
  informacoesNecessarias: string[];
  tempoAtendimento: string;
  legislacao?: string[];
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  requiresAuth: boolean;
  detailedInfo?: DetailedServiceInfo;
  fields: FormField[];
  slaHours?: number;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'date' | 'cpf' | 'phone' | 'email' | 'address';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// =============================================================================
// Tipos para Usuário e Autenticação
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  role: string;
  address?: Address;
  createdAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// =============================================================================
// Tipos para Solicitações/Protocolos
// =============================================================================

export interface ServiceRequest {
  id: string;
  protocol: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  status: string;
  origin: string;
  description: string;
  address?: Address;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  slaDeadline?: Date;
  slaBreached: boolean;
  history: RequestHistoryItem[];
  comments?: RequestComment[];
  isAnonymous: boolean;
  assigneeName?: string;
  secretariaName?: string;
  rating?: number;
  ratingComment?: string;
}

export interface RequestHistoryItem {
  id: string;
  fromStatus?: string;
  toStatus: string;
  message: string;
  createdAt: Date;
  isPublic: boolean;
  userName?: string;
}

export interface RequestComment {
  id: string;
  content: string;
  isInternal: boolean;
  userName: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// =============================================================================
// Tipos para Notícias e FAQ
// =============================================================================

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  publishedAt: Date;
  author: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
}

// =============================================================================
// Tipos para formulários
// =============================================================================

export interface LoginFormData {
  cpf: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RequestFormData {
  serviceId: string;
  description: string;
  address?: Address;
  attachments?: File[];
  isAnonymous: boolean;
  origin?: string;
}

// =============================================================================
// Tipos para API
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// Tipos para Dashboard e Relatórios
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
}

export interface RequestsByStatusChart {
  status: string;
  statusLabel: string;
  count: number;
  color: string;
}

// =============================================================================
// Tipos para Filtros do Admin
// =============================================================================

export interface RequestFilters {
  status?: string;
  serviceId?: string;
  categoryId?: string;
  neighborhood?: string;
  origin?: string;
  dateFrom?: string;
  dateTo?: string;
  slaBreached?: boolean;
  assigneeId?: string;
  departmentId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Tipos para Acessibilidade
// =============================================================================

export type FontSize = 'normal' | 'large' | 'larger';
export type ContrastMode = 'normal' | 'high';

export interface AccessibilitySettings {
  fontSize: FontSize;
  contrastMode: ContrastMode;
}
