# Portal 2909 - Central de Atendimento ao Cidadão

Portal de serviços da Prefeitura Municipal de Belford Roxo, inspirado no 1746.rio da Prefeitura do Rio de Janeiro.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** versão 18 ou superior ([download](https://nodejs.org/))
- **npm** (já vem com o Node.js)

Para verificar se já tem instalado, abra o terminal e digite:
```bash
node -v   # deve mostrar v18.x.x ou superior
npm -v    # deve mostrar 9.x.x ou superior
```

---

### 🪟 Instalação no Windows

1. **Baixe o Node.js** em [nodejs.org](https://nodejs.org/) (escolha a versão LTS)
2. **Instale** seguindo o assistente (próximo, próximo, concluir)
3. **Abra o Prompt de Comando, PowerShell ou Terminal do VS Code**
4. **Navegue até a pasta do projeto:**
```cmd
cd C:\Caminho\Para\portal-2909
```

5. **Instale as dependências:**
```cmd
npm install
```

6. **Rode o servidor:**
```cmd
npm run dev
```

7. **Acesse no navegador:**
```
http://localhost:3000
```

> 💡 **Dica:** No Windows, você pode abrir o terminal diretamente na pasta clicando com botão direito na pasta e selecionando "Abrir no Terminal" ou "Abrir janela do PowerShell aqui".

---

### 🍎 Instalação no macOS / Linux

1. **Instale o Node.js:**
   - macOS: `brew install node` (com Homebrew) ou baixe em [nodejs.org](https://nodejs.org/)
   - Linux: `sudo apt install nodejs npm` (Ubuntu/Debian)

2. **Abra o Terminal**

3. **Navegue até a pasta do projeto:**
```bash
cd /caminho/para/portal-2909
```

4. **Instale as dependências:**
```bash
npm install
```

5. **Rode o servidor:**
```bash
npm run dev
```

6. **Acesse no navegador:**
```
http://localhost:3000
```

---

## 📦 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia o servidor de produção (após build) |
| `npm run lint` | Verifica erros de código |

---

## 📁 Estrutura do Projeto

```
portal-2909/
├── public/                    # Arquivos públicos (imagens, favicon)
│   ├── images/
│   │   ├── logo-2909.png      # Logo do portal
│   │   └── logo-belford-roxo.png  # Brasão da prefeitura
│   ├── favicon.ico
│   └── icon-192.png
│
├── src/
│   ├── app/                   # Páginas (App Router do Next.js)
│   │   ├── page.tsx           # Página inicial
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globais
│   │   ├── auth/              # Página de login/cadastro
│   │   ├── servicos/          # Páginas de serviços
│   │   ├── solicitacao/       # Página de nova solicitação
│   │   ├── consulta/          # Consulta de protocolo
│   │   ├── faq/               # Perguntas frequentes
│   │   ├── ouvidoria/         # Ouvidoria
│   │   └── api/               # Rotas de API
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Cabeçalho
│   │   │   ├── Footer.tsx     # Rodapé
│   │   │   └── Sidebar.tsx    # Menu lateral
│   │   └── ui/
│   │       ├── Banner.tsx     # Carrossel da home
│   │       ├── Button.tsx     # Botão
│   │       ├── Input.tsx      # Campo de entrada
│   │       └── Card.tsx       # Card
│   │
│   ├── data/
│   │   └── services.ts        # Dados dos serviços e categorias
│   │
│   ├── lib/
│   │   ├── utils.ts           # Funções utilitárias
│   │   ├── auth.ts            # Funções de autenticação
│   │   └── requests.ts        # Funções de solicitações
│   │
│   └── types/
│       └── index.ts           # Tipos TypeScript
│
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── README.md
```

---

## 🎨 Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** - Framework React com SSR
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilização
- **[Lucide React](https://lucide.dev/)** - Ícones

---

## 🔧 Configurações

### Cores da Prefeitura de Belford Roxo

As cores principais estão definidas em `src/app/globals.css`:

- **Azul Principal:** `#1748ae`
- **Azul Secundário:** `#0094de`
- **Amarelo Destaque:** `#eab308`

### Alterando o Logo

Para trocar os logos, substitua os arquivos em:
- `public/images/logo-2909.png` - Logo do portal (recomendado: 400x170px)
- `public/images/logo-belford-roxo.png` - Brasão da prefeitura

---

## 📋 Funcionalidades

- ✅ Listagem de categorias de serviços
- ✅ Detalhes de cada serviço com informações completas
- ✅ Formulário de abertura de solicitação
- ✅ Consulta de protocolo
- ✅ Sistema de login/cadastro (frontend)
- ✅ Design responsivo (mobile e desktop)
- ✅ Acessibilidade (aumentar/diminuir fonte, alto contraste)
- ✅ Banner carrossel na página inicial
- ✅ Integração com VLibras

---

## 🚀 Deploy em Produção

### Opção 1: Vercel (Recomendado)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Deploy automático!

### Opção 2: Build Manual

```bash
# Gerar build de produção
npm run build

# Iniciar servidor
npm run start
```

---

## 📝 Próximos Passos (TODO)

- [ ] Conectar com banco de dados real
- [ ] Implementar autenticação com JWT
- [ ] Sistema de notificações por email
- [ ] Painel administrativo
- [ ] Integração com API de geolocalização

---

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido para a Prefeitura Municipal de Belford Roxo.

---

**Desenvolvido com ❤️ para os cidadãos de Belford Roxo**
