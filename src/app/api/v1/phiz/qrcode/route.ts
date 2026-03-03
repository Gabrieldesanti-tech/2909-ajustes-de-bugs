// =============================================================================
// POST /api/v1/phiz/qrcode
// Generates Phiz login QR code and returns scanToken for polling
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/lib/db";
import { generateLoginQRCode } from "@/lib/phiz";

/** Base URL for callbacks - must be publicly accessible */
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const scanToken = randomUUID();
    const baseUrl = getBaseUrl(request);
    const callbackUrl = `${baseUrl}/api/v1/phiz/callback?token=${scanToken}`;

    const result = await generateLoginQRCode(callbackUrl);

    if (!result.success || !result.qrcode_url) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Falha ao gerar QR code" },
        { status: 500 }
      );
    }

    const expireTime = result.expire_time ?? 300; // 5 minutes default
    const expiresAt = new Date(Date.now() + expireTime * 1000);

    await prisma.phizLoginSession.create({
      data: {
        scanToken,
        status: "PENDING",
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        qrcode_url: result.qrcode_url,
        scan_token: scanToken,
        expire_time: expireTime,
      },
    });
  } catch (error) {
    console.error("[Phiz] QR code route error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao gerar QR code" },
      { status: 500 }
    );
  }
}
