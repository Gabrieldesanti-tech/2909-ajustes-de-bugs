import "server-only";

const SERVICE_TOKEN_BUFFER_MS = 30_000;

type ServiceAccountTokenCache = {
  accessToken: string;
  expiresAt: number;
};

declare global {
  var __portal2909ServiceAccountTokenCache: ServiceAccountTokenCache | undefined;
}

function getBackendApiUrl() {
  return process.env.BACKEND_API_URL?.replace(/\/$/, "");
}

function getServiceAccountCredentials() {
  return {
    clientId: process.env.SERVICE_ACCOUNT_CLIENT_ID?.trim() ?? "",
    clientSecret: process.env.SERVICE_ACCOUNT_CLIENT_SECRET?.trim() ?? "",
  };
}

function getCachedToken() {
  const cache = globalThis.__portal2909ServiceAccountTokenCache;

  if (!cache) {
    return null;
  }

  if (cache.expiresAt <= Date.now()) {
    globalThis.__portal2909ServiceAccountTokenCache = undefined;
    return null;
  }

  return cache;
}

function setCachedToken(accessToken: string, expiresInSeconds?: number) {
  const ttlMs = Math.max((expiresInSeconds ?? 300) * 1000 - SERVICE_TOKEN_BUFFER_MS, 1_000);

  globalThis.__portal2909ServiceAccountTokenCache = {
    accessToken,
    expiresAt: Date.now() + ttlMs,
  };
}

function extractErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const source = payload as Record<string, unknown>;

  if (typeof source.message === "string" && source.message.trim()) {
    return source.message;
  }

  if (typeof source.error === "string" && source.error.trim()) {
    return source.error;
  }

  return undefined;
}

export function hasServiceAccountConfig() {
  const backendApiUrl = getBackendApiUrl();
  const { clientId, clientSecret } = getServiceAccountCredentials();

  return Boolean(backendApiUrl && clientId && clientSecret);
}

export async function getServiceAccountAccessToken() {
  const cached = getCachedToken();
  if (cached) {
    return cached.accessToken;
  }

  const backendApiUrl = getBackendApiUrl();
  const { clientId, clientSecret } = getServiceAccountCredentials();

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL não está configurada.");
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      "SERVICE_ACCOUNT_CLIENT_ID e SERVICE_ACCOUNT_CLIENT_SECRET são obrigatórios para o proxy autenticado."
    );
  }

  const response = await fetch(`${backendApiUrl}/api/v1/auth/service-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  const data =
    payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)
      ? (payload as Record<string, unknown>).data
      : payload;

  const source = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const accessToken =
    (source?.accessToken as string | undefined) ??
    ((payload as Record<string, unknown> | null)?.accessToken as string | undefined);
  const expiresIn =
    (source?.expiresIn as number | undefined) ??
    ((payload as Record<string, unknown> | null)?.expiresIn as number | undefined);

  if (!response.ok || !accessToken) {
    const message =
      extractErrorMessage(payload) ??
      response.statusText ??
      "Não foi possível obter o token da service account.";

    throw new Error(message);
  }

  setCachedToken(accessToken, expiresIn);

  return accessToken;
}
