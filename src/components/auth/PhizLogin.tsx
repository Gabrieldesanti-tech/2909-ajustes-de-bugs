"use client";

import { useState, useEffect, useCallback } from "react";
import { QrCode, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { apiGet, apiPost, ApiEnvelope, extractSession, fetchCurrentUser, setStoredSession } from "@/lib/api";
import type { AuthTokenData, PhizQrCodeData, PhizScanStatusResponse } from "@/types";

const POLL_INTERVAL_MS = 2000;

export default function PhizLogin() {
  const [step, setStep] = useState<"idle" | "loading" | "scanning" | "success" | "error">("idle");
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null);
  const [scanToken, setScanToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startPhizLogin = useCallback(async () => {
    setStep("loading");
    setError(null);
    try {
      const data = await apiPost<ApiEnvelope<PhizQrCodeData>>(
        "/api/v1/integrations/phiz/qrcode"
      );
      const qrcodeUrl = data.data?.qrcodeUrl;
      const scanToken = data.data?.scanToken;

      if (!data.success || !qrcodeUrl || !scanToken) {
        setError(data.error ?? "Falha ao gerar QR code");
        setStep("error");
        return;
      }
      setQrcodeUrl(qrcodeUrl);
      setScanToken(scanToken);
      setStep("scanning");
    } catch {
      setError(
        "Erro ao conectar. Verifique se o site está registrado na plataforma Phiz."
      );
      setStep("error");
    }
  }, []);

  useEffect(() => {
    if (step !== "scanning" || !scanToken) return;

    const poll = async () => {
      try {
        const data = await apiGet<ApiEnvelope<never> & PhizScanStatusResponse>(
          `/api/v1/integrations/phiz/check-scan?token=${encodeURIComponent(scanToken)}`
        );
        if (!data.success) return;

        const status = data.status;
        const phizUserId = data.phizUserId;

        if (status === "EXPIRED") {
          setError("QR code expirado. Clique para gerar um novo.");
          setStep("error");
          return;
        }

        if (status === "COMPLETED" && phizUserId) {
          setStep("loading");
          const loginData = await apiPost<ApiEnvelope<AuthTokenData>>("/api/v1/integrations/phiz/login", {
            scanToken,
          });
          const loginMeta = loginData as ApiEnvelope<AuthTokenData> & { code?: string };

          const session = extractSession(loginData);

          if (loginData.success && session) {
            setStoredSession(session);
            const me = await fetchCurrentUser().catch(() => session.user ?? null);
            setStep("success");
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get("redirect");
            const userRole = me?.role || session.user?.role || "";
            const isStaff = ["ADMIN", "MANAGER", "ANALYST", "ATTENDANT"].includes(userRole);
            const redirectTo = redirectParam ?? (isStaff ? "/admin" : "/");
            window.location.href = redirectTo;
          } else if (loginMeta.code === "PHIZ_NOT_LINKED") {
            setError(
              "Sua conta Phiz ainda não está vinculada. Cadastre-se no portal e vincule nas configurações da sua conta."
            );
            setStep("error");
          } else {
            const message = typeof loginMeta.error === "string" ? loginMeta.error : "Erro ao fazer login";
            setError(message);
            setStep("error");
          }
        }
      } catch {
        // Keep polling on transient errors
      }
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => clearInterval(interval);
  }, [step, scanToken]);

  if (step === "idle") {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={startPhizLogin}
          leftIcon={<QrCode size={20} />}
        >
          Entrar com Phiz (QR Code)
        </Button>
      </div>
    );
  }

  if (step === "loading" && !qrcodeUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="mt-3 text-sm text-neutral-600">Gerando QR code...</p>
      </div>
    );
  }

  if (step === "scanning" && qrcodeUrl) {
    return (
      <div className="flex flex-col items-center py-4">
        <p className="text-sm text-neutral-600 mb-4 text-center">
          Escaneie o QR code com o app Phiz para entrar
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrcodeUrl}
          alt="QR Code para login via Phiz"
          className="w-48 h-48 object-contain border border-neutral-200 rounded-lg"
        />
        <p className="mt-4 text-xs text-neutral-500">Aguardando escaneamento...</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => {
              setStep("idle");
              setError(null);
              setQrcodeUrl(null);
              setScanToken(null);
            }}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            size="lg"
            onClick={startPhizLogin}
            leftIcon={<QrCode size={20} />}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (step === "success" || (step === "loading" && qrcodeUrl)) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="mt-3 text-sm text-neutral-600">Entrando...</p>
      </div>
    );
  }

  return null;
}
