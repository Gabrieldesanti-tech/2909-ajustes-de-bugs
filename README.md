# Portal 2909

Frontend Next.js do Portal 2909 consumindo um backend HTTP externo via BFF no Next.js.

O projeto foi refatorado para funcionar como `frontend-only`:
- sem Prisma
- sem catálogo estático duplicado
- com proxy server-side em `src/app/api/v1/[...path]/route.ts`

Toda a leitura e escrita de dados agora acontece via chamadas para `/api/v1/*`, atendidas por um proxy no servidor do Next que conversa com o backend definido em `BACKEND_API_URL`.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`

## Como rodar localmente

### Pré-requisitos

- `Node.js 20.9+`
- `npm 10+`
- um backend HTTP disponível com os endpoints do contrato anexado

### 1. Configurar ambiente

Crie um arquivo `.env.local` com base no exemplo:

```bash
cp .env.example .env.local
```

Variáveis:

- `BACKEND_API_URL`: URL base do backend, por exemplo `http://localhost:4000`
- `SERVICE_ACCOUNT_CLIENT_ID`: client id da service account usada pelo BFF
- `SERVICE_ACCOUNT_CLIENT_SECRET`: client secret da service account usada pelo BFF

Exemplo:

```env
BACKEND_API_URL=http://localhost:4000
SERVICE_ACCOUNT_CLIENT_ID=web-portal
SERVICE_ACCOUNT_CLIENT_SECRET=
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Subir o frontend

```bash
npm run dev
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

## Fluxo de autenticação local

Como o frontend não tem mais backend embutido, a página [src/app/auth/page.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/auth/page.tsx) trabalha com os contratos expostos pelo backend:

- colar manualmente um bearer token
- usar `POST /api/v1/auth/login`
- usar `POST /api/v1/auth/register`
- usar `POST /api/v1/auth/exchange`
- usar o fluxo Phiz

O token do usuário continua salvo em `localStorage` pelo cliente HTTP em [src/lib/api.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/lib/api.ts), mas a service account passa a ser gerida apenas no servidor pelo proxy em [src/app/api/v1/[...path]/route.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/api/v1/[...path]/route.ts).

## Arquitetura atual

### Pastas principais

- `src/app`: páginas do portal e do admin
- `src/components`: componentes de UI e layout
- `src/lib/api.ts`: cliente HTTP, sessão local e helpers de autenticação
- `src/types`: tipos compartilhados
- `docs`: documentação de contratos e mapeamento

### BFF para backend

O arquivo [src/app/api/v1/[...path]/route.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/api/v1/[...path]/route.ts) recebe as chamadas de `/api/v1/*`, repassa ao backend e injeta o header `x-service-authorization` com um token de service account obtido no servidor.

Isso mantém o frontend simples:
- sem expor a URL real do backend no navegador
- sem expor `clientSecret` ou token de service account no frontend
- com um ponto único para autenticação técnica entre web e API

## Scripts

- `npm run dev`: desenvolvimento
- `npm run build`: build de produção
- `npm run start`: sobe a build de produção
- `npm run lint`: valida o código

## Docker

Build local da imagem:

```bash
docker build -t portal-2909 .
```

Executar:

```bash
docker run --rm -p 3000:3000 \
  -e BACKEND_API_URL=http://host.docker.internal:4000 \
  portal-2909
```

Se o backend rodar fora do container, ajuste `BACKEND_API_URL` conforme o ambiente.

Subida simplificada com Compose:

```bash
docker compose up --build
```

## Deploy

O projeto gera saída `standalone`, então ele pode rodar em:

- Docker
- Railway
- Fly.io
- ECS/Fargate
- qualquer ambiente com Node 20+

## Observações da refatoração

- o backend antigo embutido no Next foi removido
- a cópia duplicada `2909-main` foi eliminada
- o catálogo de serviços agora depende exclusivamente da API
- as telas admin usam guard client-side com bearer token
- a autenticação técnica da service account web agora acontece server-side

## Referências úteis

- Contratos e mapeamento: [docs/backend-frontend-contracts.md](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/docs/backend-frontend-contracts.md)
- Cliente HTTP: [src/lib/api.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/lib/api.ts)
- Proxy/BFF: [src/app/api/v1/[...path]/route.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/api/v1/[...path]/route.ts)
