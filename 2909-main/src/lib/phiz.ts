// =============================================================================
// Phiz Open Platform API Client
// =============================================================================
// Integrates with Phiz for QR code login and user identity sync.
// See: Open Platform Integration Guide (access-guide)
// Set PHIZ_QRCODE_API_URL in .env when you have the production API URL.
// =============================================================================

const PHIZ_QRCODE_API =
  process.env.PHIZ_QRCODE_API_URL ??
  "https://s.apifox.cn/cb4d6a3e-04ce-4b5a-ae0c-20f7f124b902";

export interface PhizQRCodeResponse {
  code: number;
  message: string;
  data?: {
    qrcode_url: string;
    expire_time: number;
  };
}

/** Generate login QR code from Phiz API */
export async function generateLoginQRCode(
  callbackUrl: string
): Promise<{ success: boolean; qrcode_url?: string; expire_time?: number; error?: string }> {
  try {
    const response = await fetch(PHIZ_QRCODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_url: callbackUrl }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return {
        success: false,
        error:
          "API Phiz indisponível. Verifique se o site está registrado e aprovado na plataforma Phiz.",
      };
    }

    const data = (await response.json()) as PhizQRCodeResponse;

    if (data.code !== 0 || !data.data?.qrcode_url) {
      return {
        success: false,
        error: data.message || "Falha ao gerar QR code",
      };
    }

    return {
      success: true,
      qrcode_url: data.data.qrcode_url,
      expire_time: data.data.expire_time,
    };
  } catch (error) {
    console.error("[Phiz] QR code generation error:", error);
    return {
      success: false,
      error:
        "API Phiz indisponível. Verifique se o site está registrado e aprovado na plataforma Phiz.",
    };
  }
}
