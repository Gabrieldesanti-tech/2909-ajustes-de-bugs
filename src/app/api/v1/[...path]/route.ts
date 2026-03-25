import type { NextRequest } from "next/server";
import { getServiceAccountAccessToken, hasServiceAccountConfig } from "@/lib/server/service-account";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const REQUEST_HEADERS_TO_SKIP = new Set([
  "connection",
  "content-length",
  "host",
  "transfer-encoding",
]);

const RESPONSE_HEADERS_TO_SKIP = new Set([
  "connection",
  "content-length",
  "content-encoding",
  "keep-alive",
  "transfer-encoding",
]);

function getBackendApiUrl() {
  return process.env.BACKEND_API_URL?.replace(/\/$/, "");
}

function buildUpstreamUrl(path: string[], search: string) {
  const backendApiUrl = getBackendApiUrl();

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL não está configurada.");
  }

  const normalizedPath = path.join("/");

  return `${backendApiUrl}/api/v1/${normalizedPath}${search}`;
}

async function buildUpstreamHeaders(request: NextRequest) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (REQUEST_HEADERS_TO_SKIP.has(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  if (hasServiceAccountConfig()) {
    const serviceToken = await getServiceAccountAccessToken();
    headers.set("x-service-authorization", `Bearer ${serviceToken}`);
  }

  return headers;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  try {
    const { path = [] } = await context.params;
    const upstreamUrl = buildUpstreamUrl(path, request.nextUrl.search);
    const headers = await buildUpstreamHeaders(request);
    const method = request.method.toUpperCase();
    const body =
      method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    upstreamResponse.headers.forEach((value, key) => {
      if (RESPONSE_HEADERS_TO_SKIP.has(key.toLowerCase())) {
        return;
      }

      responseHeaders.set(key, value);
    });

    return new Response(await upstreamResponse.arrayBuffer(), {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível processar a requisição.";

    return Response.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
