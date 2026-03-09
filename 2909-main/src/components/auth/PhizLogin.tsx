"use client";

import { useState, useEffect, useCallback } from "react";
import { QrCode, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

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
      const res = await fetch("/api/v1/phiz/qrcode", { method: "POST" });
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        setError(
          "API indisponível. Verifique se o site está registrado na plataforma Phiz."
        );
        setStep("error");
        return;
      }
      const data = await res.json();
      if (!data.success || !data.data?.qrcode_url) {
        setError(data.error ?? "Falha ao gerar QR code");
        setStep("error");
        return;
      }
      setQrcodeUrl(data.data.qrcode_url);
      setScanToken(data.data.scan_token);
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
        const res = await fetch(`/api/v1/phiz/check-scan?token=${encodeURIComponent(scanToken)}`);
        const data = await res.json();
        if (!data.success) return;

        if (data.status === "EXPIRED") {
          setError("QR code expirado. Clique para gerar um novo.");
          setStep("error");
          return;
        }

        if (data.status === "COMPLETED" && data.phiz_user_id) {
          setStep("loading");
          const loginRes = await fetch("/api/v1/phiz/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scan_token: scanToken }),
          });
          const loginData = await loginRes.json();

          if (loginData.success) {
            setStep("success");
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get("redirect");
            const userRole = loginData.data?.user?.role;
            const isStaff = ["ADMIN", "MANAGER", "ANALYST", "ATTENDANT"].includes(userRole);
            const redirectTo = redirectParam ?? (isStaff ? "/admin" : "/");
            window.location.href = redirectTo;
          } else if (loginData.code === "PHIZ_NOT_LINKED") {
            setError(
              "Sua conta Phiz ainda não está vinculada. Cadastre-se no portal e vincule nas configurações da sua conta."
            );
            setStep("error");
          } else {
            setError(loginData.error ?? "Erro ao fazer login");
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
