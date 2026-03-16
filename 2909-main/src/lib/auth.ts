// =============================================================================
// Sistema de Autenticação Seguro
// =============================================================================
// Decisão técnica:
// - bcryptjs para hash de senhas (custo computacional dificulta brute-force)
// - jose para JWT (biblioteca moderna, suporte a Edge Runtime do Next.js)
// - Cookies httpOnly + Secure para tokens (proteção contra XSS)
// - Refresh token com rotação para sessões longas
// =============================================================================

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import prisma from "./db";
import { type UserRole } from "@/types";

// Configurações
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portal-2909-dev-secret-change-in-production-32chars"
);
const TOKEN_EXPIRY = "8h"; // Token de acesso expira em 8 horas
const SALT_ROUNDS = 12; // Custo do bcrypt (12 é bom para produção)
const COOKIE_NAME = "auth_token";

// =============================================================================
// TIPOS
// =============================================================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
}

interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  cpf: string;
  role: UserRole;
}

// =============================================================================
// HASH DE SENHA
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =============================================================================
// JWT - GERAÇÃO E VERIFICAÇÃO
// =============================================================================

export async function generateToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    cpf: user.cpf,
    role: user.role,
  } as TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuer("portal-2909")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{
  valid: boolean;
  payload?: TokenPayload;
}> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "portal-2909",
    });
    return { valid: true, payload: payload as TokenPayload };
  } catch {
    return { valid: false };
  }
}

// =============================================================================
// REGISTRO DE USUÁRIO
// =============================================================================

export async function registerUser(data: {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Verificar se CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf: data.cpf.replace(/\D/g, "") },
    });
    if (existingCpf) {
      return { success: false, error: "CPF já cadastrado" };
    }

    // Verificar se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existingEmail) {
      return { success: false, error: "E-mail já cadastrado" };
    }

    // Criar usuário com senha hasheada
    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        cpf: data.cpf.replace(/\D/g, ""),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.replace(/\D/g, "") || null,
        passwordHash,
        role: "CITIZEN",
        consentedAt: new Date(),
        consentVersion: "1.0",
      },
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "users",
        entityId: user.id,
        newValues: JSON.stringify({ name: data.name, email: data.email }),
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, error: "Erro interno ao criar conta" };
  }
}

// =============================================================================
// LOGIN
// =============================================================================

export async function loginUser(
  cpf: string,
  password: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<{
  success: boolean;
  error?: string;
  token?: string;
  user?: AuthUser;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { cpf: cpf.replace(/\D/g, "") },
    });

    if (!user || user.deletedAt) {
      return { success: false, error: "CPF não encontrado" };
    }

    if (!user.isActive) {
      return { success: false, error: "Conta desativada. Entre em contato com o suporte." };
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return { success: false, error: "Senha incorreta" };
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      role: user.role as UserRole,
    };

    const token = await generateToken(authUser);

    // Criar sessão no banco
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: metadata?.userAgent || null,
        ipAddress: metadata?.ipAddress || null,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8h
      },
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "sessions",
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    return { success: true, token, user: authUser };
  } catch (error) {
    console.error("Erro no login:", error);
    return { success: false, error: "Erro interno ao fazer login" };
  }
}

// =============================================================================
// OBTER USUÁRIO AUTENTICADO
// =============================================================================

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const { valid, payload } = await verifyToken(token);
    if (!valid || !payload) return null;

    // Verificar se sessão ainda existe e está ativa
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      cpf: payload.cpf,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// =============================================================================
// LOGOUT
// =============================================================================

export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token) {
      // Invalidar sessão no banco
      await prisma.session.deleteMany({ where: { token } });
    }
  } catch (error) {
    console.error("Erro no logout:", error);
  }
}

// =============================================================================
// VERIFICAÇÃO DE PERMISSÕES
// =============================================================================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  CITIZEN: 0,
  ATTENDANT: 1,
  ANALYST: 2,
  MANAGER: 3,
  ADMIN: 4,
};

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function isAdmin(user: AuthUser): boolean {
  return user.role === "ADMIN";
}

export function isStaff(user: AuthUser): boolean {
  return hasMinRole(user.role, "ATTENDANT");
}

// =============================================================================
// CRIAR ADMIN PADRÃO (para primeiro acesso)
// =============================================================================

export async function ensureDefaultAdmin(): Promise<void> {
  const adminExists = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminExists) {
    const passwordHash = await hashPassword("12345");
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@belfordroxo.rj.gov.br",
        cpf: "10746426780",
        passwordHash,
        role: "ADMIN",
        isActive: true,
        emailVerified: true,
      },
    });
    console.log("✅ Admin padrão criado: CPF 107.464.267-80 / Senha 12345");
  }
}
