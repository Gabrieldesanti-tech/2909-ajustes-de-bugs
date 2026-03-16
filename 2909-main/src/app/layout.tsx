// =============================================================================
// Layout Raiz - Portal Público
// =============================================================================
// Melhorias implementadas:
// - HTML semântico com landmarks ARIA
// - Skip navigation para acessibilidade
// - Preconnect para fontes e APIs externas
// - Meta viewport otimizada para mobile
// - Manifest PWA e ícones configurados
// =============================================================================

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityBar from "@/components/ui/AccessibilityBar";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1748ae",
};

export const metadata: Metadata = {
  title: {
    default: "Portal 2909 - Prefeitura de Belford Roxo",
    template: "%s | Portal 2909",
  },
  description:
    "Central de atendimento ao cidadão da Prefeitura de Belford Roxo. Solicite serviços, faça denúncias e acompanhe suas solicitações pelo número de protocolo.",
  keywords: [
    "Belford Roxo",
    "prefeitura",
    "serviços públicos",
    "atendimento ao cidadão",
    "2909",
    "denúncias",
    "solicitações",
    "protocolo",
    "serviços municipais",
  ],
  authors: [{ name: "Prefeitura de Belford Roxo" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://2909.belfordroxo.rj.gov.br",
    siteName: "Portal 2909",
    title: "Portal 2909 - Prefeitura de Belford Roxo",
    description:
      "Central de atendimento ao cidadão da Prefeitura de Belford Roxo. Solicite serviços públicos e acompanhe suas demandas.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal 2909 - Prefeitura de Belford Roxo",
    description: "Central de atendimento ao cidadão",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para APIs externas usadas pelo portal */}
        <link rel="preconnect" href="https://viacep.com.br" />
        <link rel="dns-prefetch" href="https://viacep.com.br" />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        {/* Skip navigation - acessibilidade (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Pular para o conteúdo principal
        </a>

        <Header />
        <main
          id="main-content"
          role="main"
          className="flex-1"
          style={{ backgroundColor: "#cce5f7" }}
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />
        <AccessibilityBar />
      </body>
    </html>
  );
}
