import Link from "next/link";
import Image from "next/image";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin
} from "lucide-react";

// Ícone do X (antigo Twitter)
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const institutionalLinks = [
  { name: "Lei de Acesso à Informação", href: "/lai" },
  { name: "Ouvidoria", href: "/ouvidoria" },
  { name: "Termo de Uso e Privacidade Central 2909", href: "/termos" },
  { name: "Termo de Uso e Privacidade Portal 2909", href: "/privacidade" },
  { name: "Termo de Uso e Privacidade Portal 2909 APP", href: "/privacidade-app" },
  { name: "Termo de Uso e Privacidade Atendimento Presencial 2909", href: "/privacidade-presencial" },
  { name: "Termo de Uso e Privacidade WhatsApp 2909", href: "/privacidade-whatsapp" },
];

const serviceLinks = [
  { name: "Serviços", href: "/" },
  { name: "Acompanhe sua Solicitação", href: "/consulta" },
  { name: "Perguntas Frequentes", href: "/faq" },
  { name: "Exclusão do cadastro", href: "/excluir-cadastro" },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/prefeituradebelfordroxo/", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/PrefeituradeBelfordRoxo/", icon: Facebook },
  { name: "X", href: "https://x.com/Prefbelroxo2", icon: XIcon },
  { name: "Youtube", href: "https://www.youtube.com/@prefeituradebelfordroxo", icon: Youtube },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/prefeitura-municipal-de-belford-roxo/", icon: Linkedin },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1748ae' }} className="text-white">
      {/* Linha de números de telefone */}
      <div style={{ backgroundColor: '#374151' }}>
        <div className="container-main py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
            <p>
              <strong>Município de Belford Roxo:</strong> 2909
            </p>
            <p>
              <strong>Demais localidades:</strong> (21) 2666-2909 *
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal do footer */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo e informações da prefeitura - estilo 1746 */}
          <div className="lg:col-span-1">
            {/* Logo alinhado à esquerda */}
            <div className="mb-4">
              <Image
                src="/images/logo-belford-roxo.png"
                alt="Brasão da Prefeitura Municipal de Belford Roxo"
                width={220}
                height={100}
                className="object-contain object-left"
              />
            </div>
            
            {/* Nome da prefeitura - igual ao 1746 */}
            <p className="text-base text-white/90 mb-6">
              Prefeitura Municipal de Belford Roxo
            </p>
            
            {/* Endereço - espaçamento igual ao 1746 */}
            <address className="not-italic text-base text-white/80 space-y-0.5 leading-relaxed">
              <p>Av. Joaquim da Costa Lima, 3250</p>
              <p>São Bernardo - Belford Roxo - RJ</p>
              <p>CEP: 26167-325</p>
            </address>
            
            {/* Redes sociais */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  title={social.name}
                  aria-label={`Visite nosso ${social.name}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="text-lg font-bold mb-6">Institucional</h3>
            <ul className="space-y-3">
              {institutionalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links de Serviços */}
          <div>
            <h3 className="text-lg font-bold mb-6">Serviços</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contato</h3>
            <div className="space-y-4 text-sm text-white/80">
              <div>
                <p className="font-semibold text-white mb-1">E-mail:</p>
                <a
                  href="mailto:ouvidoriageral@prefeituradebelfordroxo.rj.gov.br"
                  className="hover:text-white hover:underline transition-colors break-all"
                >
                  ouvidoriageral@prefeituradebelfordroxo.rj.gov.br
                </a>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Horário de atendimento:</p>
                <p>Segunda a Sexta: 8h às 17h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha de atenção */}
      <div style={{ backgroundColor: '#0d3380' }}>
        <div className="container-main py-4">
          <p className="text-xs text-center text-white/70">
            <strong>*Atenção:</strong> As ligações para os números 2909 e (21) 2666-2909 são tarifadas ao custo de uma ligação de telefone fixo.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ backgroundColor: '#0a2a6e' }}>
        <div className="container-main py-4">
          <p className="text-xs text-center text-white/60">
            © {new Date().getFullYear()} - PMBR - Prefeitura Municipal de Belford Roxo | CNPJ: 39.485.438/0001-42 | Todos os direitos reservados.
          </p>
        </div>
      </div>

    </footer>
  );
}
