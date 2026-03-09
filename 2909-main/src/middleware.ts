// =============================================================================
// Middleware Next.js - Proteção de Rotas e Rate Limiting
// =============================================================================
// Decisão técnica: Middleware no Edge Runtime para:
// 1. Proteger rotas admin sem precisar verificar em cada página
// 2. Rate limiting básico por IP
// 3. Headers de segurança
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "portal-2909-dev-secret-change-in-production-32chars"
);

// Rate limiting em memória (por IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 60; // 60 requisições por minuto

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting para API
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Muitas requisições. Tente novamente em breve." },
        { status: 429 }
      );
    }
  }

  // Proteção de rotas administrativas
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth?redirect=/admin", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: "portal-2909" });
      
      // Verificar se tem permissão de staff (ATTENDANT ou superior)
      const staffRoles = ["ATTENDANT", "ANALYST", "MANAGER", "ADMIN"];
      if (!staffRoles.includes(payload.role as string)) {
        return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth?redirect=/admin", request.url));
    }
  }

  // Headers de segurança
  const response = NextResponse.next();
  
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};
