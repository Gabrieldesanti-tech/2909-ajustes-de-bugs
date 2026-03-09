"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Menu, 
  X, 
  Moon,
  User
} from "lucide-react";
import { FontSize, ContrastMode } from "@/types";

const navItems = [
  { name: "Serviços", href: "/", highlight: true },
  { name: "Lei de Acesso à Informação", href: "/lai" },
  { name: "Ouvidoria", href: "/ouvidoria" },

  { name: "Consulta Protocolo", href: "/consulta" },
  { name: "Notícias", href: "/noticias" },
  { name: "Relatórios", href: "/relatorios" },
  { name: "Perguntas Frequentes", href: "/faq" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [contrastMode, setContrastMode] = useState<ContrastMode>("normal");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-size-normal", "font-size-large", "font-size-larger");
    root.classList.add(`font-size-${fontSize}`);
    
    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [fontSize, contrastMode]);

  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("larger");
  };

  const decreaseFontSize = () => {
    if (fontSize === "larger") setFontSize("large");
    else if (fontSize === "large") setFontSize("normal");
  };

  const toggleContrast = () => {
    setContrastMode(contrastMode === "normal" ? "high" : "normal");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Header principal - azul igual ao site oficial de Belford Roxo */}
      <div style={{ backgroundColor: '#1748ae' }}>
        <div className="container-main">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo oficial 2909 */}
            <Link href="/" className="flex items-center gap-4 md:gap-6">
              {/* Logo 2909 oficial */}
              <Image
                src="/images/logo-2909.png"
                alt="2909 - Central de Atendimento"
                width={220}
                height={60}
                className="h-12 md:h-16 w-auto object-contain"
                priority
              />
              
              {/* Separador */}
              <div className="hidden md:block h-16 w-px bg-white/30" />
              
              {/* Logo da Prefeitura */}
              <Image
                src="/images/logo-belford-roxo.png"
                alt="Brasão da Prefeitura Municipal de Belford Roxo - Escudo azul com símbolos representando indústria, agricultura e desenvolvimento do município"
                width={140}
                height={70}
                className="hidden md:block object-contain h-16"
              />
            </Link>

            {/* Lado direito - controles */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Acessibilidade - estilo 1746 */}
              <div className="hidden md:flex items-center gap-1 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <button
                  onClick={increaseFontSize}
                  className="px-2 py-1 text-white/90 hover:text-white transition-colors text-sm font-bold"
                  title="Aumentar fonte"
                >
                  A+
                </button>
                <button
                  onClick={decreaseFontSize}
                  className="px-2 py-1 text-white/90 hover:text-white transition-colors text-sm font-bold"
                  title="Diminuir fonte"
                >
                  A-
                </button>
                <button
                  onClick={toggleContrast}
                  className="p-1.5 text-white/90 hover:text-white transition-colors"
                  title="Alto contraste"
                >
                  <Moon size={16} />
                </button>
              </div>

              {/* Busca desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 lg:w-52 px-4 py-2 pr-10 text-sm rounded bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 border-0"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {/* Login/Cadastro */}
              <Link
                href="/auth"
                className="hidden md:flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
              >
                Acessar | Cadastrar
              </Link>

              {/* Busca mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-white/80 hover:text-white"
                aria-label="Abrir busca"
              >
                <Search size={22} />
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white/80 hover:text-white"
                aria-label="Abrir menu"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação principal - azul claro igual ao site oficial de Belford Roxo */}
      <nav style={{ backgroundColor: '#0094de' }}>
        <div className="container-main">
          <ul className="hidden md:flex items-center h-11">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                    item.highlight
                      ? "text-[#1748ae] hover:bg-yellow-400"
                      : "text-white hover:bg-white/10"
                  }`}
                  style={item.highlight ? { backgroundColor: '#eab308' } : {}}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Menu mobile expandido */}
      {isMenuOpen && (
        <div style={{ backgroundColor: '#0094de' }} className="md:hidden border-t border-white/10">
          <div className="container-main py-4">
            {/* Logo mobile */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/20">
              <Image
                src="/images/logo-belford-roxo.png"
                alt="Brasão da Prefeitura Municipal de Belford Roxo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                    item.highlight
                      ? "bg-yellow-500 text-[#1e3a5f]"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/20 mt-4">
                <Link
                  href="/auth"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  Acessar | Cadastrar
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Busca mobile expandida */}
      {isSearchOpen && (
        <div style={{ backgroundColor: '#0094de' }} className="md:hidden border-t border-white/10 p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar serviços..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 text-sm rounded bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
