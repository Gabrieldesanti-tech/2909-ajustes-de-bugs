"use client";

import { useState, useEffect } from "react";
import { Accessibility, Eye, Hand } from "lucide-react";

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-size-normal", "font-size-large", "font-size-larger");
    root.classList.add(`font-size-${fontSize}`);
    
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [fontSize, highContrast]);

  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("larger");
  };

  const decreaseFontSize = () => {
    if (fontSize === "larger") setFontSize("large");
    else if (fontSize === "large") setFontSize("normal");
  };

  return (
    <div className="fixed right-0 top-1/3 z-50 flex flex-col shadow-lg rounded-l-lg overflow-hidden">
      {/* Botão de acessibilidade - azul de Belford Roxo */}
      <button
        className="w-12 h-12 text-white flex items-center justify-center transition-colors"
        style={{ backgroundColor: '#1748ae' }}
        title="Acessibilidade"
        aria-label="Menu de acessibilidade"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d3380'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1748ae'}
      >
        <Accessibility size={22} />
      </button>

      {/* VLibras - Linguagem de sinais */}
      <button
        className="w-12 h-12 text-white flex items-center justify-center transition-colors border-t border-white/20"
        style={{ backgroundColor: '#1748ae' }}
        title="VLibras"
        aria-label="VLibras - Linguagem de Sinais"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d3380'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1748ae'}
      >
        <Hand size={22} />
      </button>
    </div>
  );
}
