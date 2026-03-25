import type { ApiEnvelope, AuthMeData, AuthTokenData, AuthUser } from "@/types";
export type { ApiEnvelope, AuthTokenData, AuthUser, AuthMeData } from "@/types";

const AUTH_STORAGE_KEY = "portal2909.auth";

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthUser | null;
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status = 500, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredSession(): AuthSession | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setStoredSession(session: AuthSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAccessToken(): string | null {
  const stored = getStoredSession()?.accessToken;
  if (stored) return stored;
  return null;
}

export function getAuthorizationHeaderValue(): string | null {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
}

export function unwrapData<T>(payload: ApiEnvelope<T> | T): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}

function extractMessageValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return undefined;
}

function extractApiMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const source = payload as Record<string, unknown>;

  return (
    extractMessageValue(source.message) ??
    extractMessageValue(source.error) ??
    (source.data && typeof source.data === "object"
      ? extractMessageValue((source.data as Record<string, unknown>).message)
      : undefined)
  );
}

function extractTokenValue(payload: unknown, candidates: string[]): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const source = payload as Record<string, unknown>;

  for (const key of candidates) {
    const direct = source[key];
    if (typeof direct === "string" && direct) return direct;
  }

  if (source.data && typeof source.data === "object") {
    const nested = source.data as Record<string, unknown>;
    for (const key of candidates) {
      const direct = nested[key];
      if (typeof direct === "string" && direct) return direct;
    }
  }

  return undefined;
}

export function extractSession(payload: unknown): AuthSession | null {
  const accessToken = extractTokenValue(payload, ["accessToken", "access_token", "token"]);
  if (!accessToken) return null;

  const refreshToken = extractTokenValue(payload, ["refreshToken", "refresh_token"]);
  const expiresIn = (() => {
    if (!payload || typeof payload !== "object") return undefined;
    const source = payload as Record<string, unknown>;
    const direct = source.expiresIn;
    if (typeof direct === "number") return direct;
    if (source.data && typeof source.data === "object") {
      const nested = (source.data as Record<string, unknown>).expiresIn;
      if (typeof nested === "number") return nested;
    }
    return undefined;
  })();
  let user: AuthUser | null | undefined;

  if (payload && typeof payload === "object") {
    const source = payload as Record<string, unknown>;
    const maybeUser =
      (source.data && typeof source.data === "object"
        ? (source.data as Record<string, unknown>).user
        : undefined) ?? source.user;

    if (maybeUser && typeof maybeUser === "object") {
      user = maybeUser as AuthUser;
    }
  }

  return { accessToken, refreshToken, expiresIn, user };
}

function setAuthSessionFromPayload(payload: ApiEnvelope<AuthTokenData> | AuthTokenData) {
  const session = extractSession(payload);

  if (!session) {
    throw new ApiError("A API não retornou um access token válido.", 500, payload);
  }

  setStoredSession(session);
  return session;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  const apiError =
    payload &&
    typeof payload === "object" &&
    "success" in (payload as Record<string, unknown>) &&
    (payload as ApiEnvelope<T>).success === false;

  if (!response.ok || apiError) {
    const message =
      extractApiMessage(payload) ||
      response.statusText ||
      "Erro na comunicação com a API";

    if (response.status === 401) {
      clearStoredSession();
    }

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export async function apiGet<T>(path: string, options: { auth?: boolean } = {}) {
  return apiRequest<T>(path, { method: "GET" }, options);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options: { auth?: boolean } = {}
) {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    options
  );
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options: { auth?: boolean } = {}
) {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    options
  );
}

export async function apiDelete<T>(
  path: string,
  body?: unknown,
  options: { auth?: boolean } = {}
) {
  return apiRequest<T>(
    path,
    {
      method: "DELETE",
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    options
  );
}

export async function exchangeIdentity(input: {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}) {
  const payload = await apiPost<ApiEnvelope<AuthTokenData>>("/api/v1/auth/exchange", {
    channel: "WEB",
    origin: "WEB",
    assertion: {
      subject: input.cpf,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone || undefined,
    },
  });

  return setAuthSessionFromPayload(payload);
}

export async function loginCitizen(input: { cpf: string; password: string }) {
  const cpf = input.cpf.replace(/\D/g, "");

  if (!cpf) {
    throw new ApiError("Informe um CPF válido.", 400);
  }

  const payload = await apiPost<ApiEnvelope<AuthTokenData>>("/api/v1/auth/login", {
    cpf,
    password: input.password,
  });
  const session = setAuthSessionFromPayload(payload);

  return session.user ?? null;
}

export async function registerCitizen(input: {
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const payload = await apiPost<ApiEnvelope<AuthTokenData>>("/api/v1/auth/register", {
    name: input.name.trim(),
    cpf: input.cpf.replace(/\D/g, ""),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.replace(/\D/g, ""),
    password: input.password,
  });
  const session = setAuthSessionFromPayload(payload);

  return session.user ?? null;
}

export async function loginWithManualToken(token: string) {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new ApiError("Informe um token válido.", 400);
  }

  setStoredSession({ accessToken: trimmed });
  const mePayload = await apiGet<ApiEnvelope<AuthMeData>>("/api/v1/auth/me", { auth: true });
  const me = unwrapData(mePayload);
  const user = me?.user;
  setStoredSession({ accessToken: trimmed, user: user ?? null });
  return user ?? null;
}

export async function logout() {
  try {
    await apiPost<ApiEnvelope<null>>("/api/v1/auth/logout", undefined, { auth: true });
  } finally {
    clearStoredSession();
  }
}

export async function fetchCurrentUser() {
  const payload = await apiGet<ApiEnvelope<AuthMeData>>("/api/v1/auth/me", { auth: true });
  const data = unwrapData(payload);
  const session = getStoredSession();

  if (session?.accessToken) {
    setStoredSession({
      ...session,
      user: data?.user ?? null,
    });
  }

  return data?.user ?? null;
}
