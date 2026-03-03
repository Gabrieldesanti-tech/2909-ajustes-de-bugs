// =============================================================================
// Phiz Open Platform API Client
// =============================================================================
// Integrates with Phiz for QR code login and user identity sync.
// See: Open Platform Integration Guide (access-guide)
// =============================================================================

const PHIZ_QRCODE_API =
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

    const data = (await response.json()) as PhizQRCodeResponse;

    if (data.code !== 0 || !data.data?.qrcode_url) {
      return {
        success: false,
        error: data.message || "Failed to generate QR code",
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
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
