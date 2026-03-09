// Função para combinar classes CSS
export function cn(...inputs: unknown[]) {
  return inputs.filter((x): x is string => typeof x === "string" && x.length > 0).join(" ");
}

// Formatação de CPF
export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Validação de CPF
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "");
  
  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(numbers.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(numbers.charAt(10))) return false;
  
  return true;
}

// Formatação de telefone
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

// Formatação de CEP
export function formatCEP(cep: string): string {
  const numbers = cep.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
}

// Gerar protocolo único
export function generateProtocol(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${year}${timestamp}${random}`;
}

// Formatação de data
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Formatação de status
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Aguardando análise",
    in_progress: "Em andamento",
    waiting_info: "Aguardando informações",
    resolved: "Resolvido",
    closed: "Encerrado",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
}

// Cor do status
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    waiting_info: "bg-orange-100 text-orange-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

// Slug generator
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sanitização básica de HTML para prevenir XSS
export function sanitizeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validação de email
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Gerar hash seguro para senhas (client-side mock - real hash no servidor)
export function hashPassword(password: string): string {
  // Esta é apenas uma representação - o hash real deve ser feito no servidor
  return btoa(password);
}
