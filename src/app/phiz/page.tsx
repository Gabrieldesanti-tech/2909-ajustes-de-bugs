"use client";

import { ArrowRight, Download, ExternalLink, Smartphone, CheckCircle } from "lucide-react";
import { openPhizDeepLink, PHIZ_STORE_URLS } from "@/lib/phiz-deeplink";

export default function PhizPage() {
  return (
    <div className="container-main py-8 md:py-10 bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <div className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-emerald-100 p-2">
              <img
                src="phiz-logo.svg"
                alt="Logo do Phiz"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                App oficial do PhizChat
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Baixe o app PhizChat para continuar seu atendimento
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm md:text-base text-neutral-600">
            Acompanhe solicitações em tempo real, receba notificações importantes e resolva tudo em um só lugar.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-xl border border-emerald-100 bg-white shadow-card overflow-hidden">
            <div className="p-5 md:p-6 space-y-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 bg-emerald-100 rounded-full px-3 py-1">
                <Smartphone size={16} aria-hidden="true" />
                Já possui o PhizChat?
              </div>
              <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                Abrir PhizChat
              </h2>
              <p className="text-sm text-neutral-600">
                Se você já tem o app instalado, clique para acessar.
              </p>
              <button
                type="button"
                onClick={() => openPhizDeepLink()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors w-full sm:w-auto cursor-pointer"
              >
                Entrar no PhizChat
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="rounded-xl border border-neutral-200 bg-white shadow-card overflow-hidden">
            <div className="p-5 md:p-6 space-y-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 bg-emerald-50 rounded-full px-3 py-1">
                <Download size={16} aria-hidden="true" />
                Não possui o PhizChat?
              </div>
              <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                Instalar Agora!
              </h2>
              <p className="text-sm text-neutral-600">
                Tente abrir o app primeiro. Se ele não estiver instalado, a loja correta será aberta em seguida.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => openPhizDeepLink({ platform: "android" })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors w-full sm:w-auto"
                >
                  <Smartphone size={18} aria-hidden="true" />
                  Android
                  <ExternalLink size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => openPhizDeepLink({ platform: "ios" })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1748ae] hover:bg-[#123b8f] text-white font-semibold transition-colors w-full sm:w-auto"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/apple-icon.png" alt="" width={18} height={18} aria-hidden="true" />
                  iOS
                  <ExternalLink size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-sm text-neutral-500 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={PHIZ_STORE_URLS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-700 hover:underline"
                >
                  Ir direto para a Play Store
                </a>
                <a
                  href={PHIZ_STORE_URLS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-700 hover:underline"
                >
                  Ir direto para a App Store
                </a>
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900">
              Tudo o que você faz com o PhizChat
            </h3>

            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 text-[#1748ae]" />
                <div>
                  <p className="font-medium text-neutral-900">
                    Atendimento simples e rápido
                  </p>
                  <p className="text-sm text-neutral-600">
                    Abra solicitações em poucos toques e acompanhe cada etapa sem sair do app.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 text-[#1748ae]" />
                <div>
                  <p className="font-medium text-neutral-900">
                    Tudo organizado em um só lugar
                  </p>
                  <p className="text-sm text-neutral-600">
                    Histórico completo de atendimentos, protocolos e mensagens sempre à mão.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-0.5 text-[#1748ae]" />
                <div>
                  <p className="font-medium text-neutral-900">
                    Notificações em tempo real
                  </p>
                  <p className="text-sm text-neutral-600">
                    Seja avisado quando algo mudar no seu atendimento.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
