# Contratos Frontend x Backend

## Objetivo

Este documento descreve o contrato ativo do frontend após a separação do backend do Next.js.

A aplicação agora é um cliente Next.js que:
- renderiza telas públicas e administrativas
- autentica com bearer token
- consome o backend externo por `/api/v1/*`
- usa um BFF em `src/app/api/v1/[...path]/route.ts` para fazer proxy para `BACKEND_API_URL`

## Arquitetura Atual

### Frontend

- framework: `Next.js 16`
- app router: `src/app`
- BFF/proxy: `src/app/api/v1/[...path]/route.ts`
- cliente HTTP central: `src/lib/api.ts`
- autenticação local: `localStorage`
- proteção do admin: `src/components/admin/AdminGuard.tsx`
- service account: gerida no servidor em `src/lib/server/service-account.ts`

### Backend

O backend é externo ao repositório e deve expor os contratos documentados no OpenAPI anexado.

### Proxy

`browser -> /api/v1/:path* -> Next Route Handler -> BACKEND_API_URL/api/v1/:path*`

Quando configurado, o BFF anexa `x-service-authorization: Bearer <service-token>` em cada request para o backend.

## Padrão de Resposta

O frontend trabalha com este envelope preferencial:

```json
{
  "success": true,
  "data": {},
  "message": "ok"
}
```

Erros:

```json
{
  "success": false,
  "error": "mensagem de erro"
}
```

## Autenticação

### Modelo adotado no frontend

- `accessToken` bearer
- persistência local em `localStorage`
- usuário atual obtido em `GET /api/v1/auth/me`
- service account web obtida apenas no servidor via `POST /api/v1/auth/service-token`

### Endpoints esperados

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/exchange`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/service-token`

### Observação importante

O OpenAPI anexado agora expõe o login por `cpf + password` e o cadastro convencional.
Por isso o frontend foi ajustado para operar com:
- login por CPF e senha
- cadastro com criação de sessão
- token manual
- exchange de identidade
- fluxo Phiz

## Mapa de Telas e Contratos

### Público

#### `/`

Objetivo:
- navegação principal
- entrada para catálogo e áreas institucionais

Dependências:
- sem contrato obrigatório para render inicial

#### `/servicos/[category]`

Objetivo:
- renderizar detalhes da categoria
- listar serviços da categoria

Endpoints:
- `GET /api/v1/catalog/categories/{slug}`

Resposta mínima esperada:

```json
{
  "success": true,
  "data": {
    "id": "cat_1",
    "name": "Iluminação Pública",
    "slug": "iluminacao-publica",
    "description": "Solicitações da categoria",
    "services": [
      {
        "id": "svc_1",
        "name": "Lâmpada apagada",
        "slug": "lampada-apagada",
        "description": "..."
      }
    ]
  }
}
```

#### `/servicos/[category]/[service]`

Objetivo:
- renderizar detalhes completos do serviço
- montar formulário ou informações operacionais

Endpoints:
- `GET /api/v1/catalog/services/{categorySlug}/{serviceSlug}`

Campos relevantes:
- `id`
- `name`
- `slug`
- `description`
- `detailedInfo`
- `fields`
- `requiresAuth`
- `slaHours`
- `category`

#### `/faq`

Endpoints:
- `GET /api/v1/public/faqs`

Resposta mínima:

```json
{
  "success": true,
  "data": [
    {
      "id": "faq_1",
      "question": "Como abrir uma solicitação?",
      "answer": "..."
    }
  ]
}
```

#### `/noticias`

Endpoints:
- `GET /api/v1/public/news`

#### `/relatorios`

Objetivo:
- exibir estatísticas públicas

Endpoints:
- `GET /api/v1/public/stats`

#### `/consulta`

Objetivo:
- consultar protocolo público

Endpoints:
- `GET /api/v1/requests/{protocol}`

Campos relevantes:
- `protocol`
- `status`
- `description`
- `createdAt`
- `updatedAt`
- `history`
- `comments`

#### `/auth`

Objetivo:
- autenticar usuário sem backend embutido

Endpoints:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/exchange`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `POST /api/v1/integrations/phiz/qrcode`
- `GET /api/v1/integrations/phiz/check-scan`
- `POST /api/v1/integrations/phiz/login`

### Administrativo

#### `/admin`

Objetivo:
- dashboard e visão consolidada

Endpoints:
- `GET /api/v1/admin/dashboard`

#### `/admin/solicitacoes`

Objetivo:
- listar e filtrar solicitações
- exportar relatório

Endpoints:
- `GET /api/v1/admin/requests`
- `GET /api/v1/admin/reports/requests/export`

Query params suportados pelo frontend:
- `search`
- `status`
- `dateFrom`
- `dateTo`
- `slaBreached`
- `page`
- `limit`
- `format`

#### `/admin/solicitacoes/[protocol]`

Objetivo:
- detalhar solicitação
- alterar status
- adicionar comentário

Endpoints:
- `GET /api/v1/requests/{protocol}`
- `PATCH /api/v1/admin/requests/{protocol}/status`
- `POST /api/v1/requests/{protocol}/comments`

Payload de mudança de status:

```json
{
  "status": "IN_PROGRESS",
  "message": "Encaminhado para equipe responsável",
  "isPublic": true
}
```

Payload de comentário:

```json
{
  "content": "Texto do comentário",
  "isInternal": false
}
```

#### `/admin/usuarios`

Endpoints:
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users`

#### `/admin/servicos`

Endpoints:
- `GET /api/v1/admin/services`
- `POST /api/v1/admin/services`
- `PATCH /api/v1/admin/services/{id}`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/{id}`
- `DELETE /api/v1/admin/categories/{id}`

Observação:
- no contrato atual não há `DELETE /api/v1/admin/services/{id}`; a inativação do serviço deve usar `PATCH /api/v1/admin/services/{id}` com `isActive`

#### `/admin/secretarias`

Endpoints:
- `GET /api/v1/admin/departments`

#### `/admin/secretarias/[slug]`

Endpoints:
- `GET /api/v1/admin/departments/{slug}`
- `GET /api/v1/admin/requests`

#### `/admin/notificacoes`

Endpoints:
- `GET /api/v1/admin/notifications`
- `PATCH /api/v1/admin/notifications/{id}/read`
- `POST /api/v1/admin/notifications/read-all`

#### `/admin/auditoria`

Endpoints:
- `GET /api/v1/admin/audit-logs`

#### `/admin/relatorios`

Endpoints:
- `GET /api/v1/admin/reports/requests/export`

#### `/admin/faq`

Situação atual:
- o OpenAPI anexado não expõe rota administrativa dedicada para FAQ
- o frontend usa `GET /api/v1/public/faqs` como fonte de leitura

## Fluxo Phiz

Endpoints usados pelo frontend:
- `POST /api/v1/integrations/phiz/qrcode`
- `GET /api/v1/integrations/phiz/check-scan?token=...`
- `POST /api/v1/integrations/phiz/login`
- `POST /api/v1/integrations/phiz/link`
- `POST /api/v1/integrations/phiz/sync-user`

## Contratos mínimos por domínio

### Catálogo

Entidades:
- `Category`
- `Service`

Campos mínimos para `Category`:
- `id`
- `name`
- `slug`
- `description`

Campos mínimos para `Service`:
- `id`
- `name`
- `slug`
- `description`
- `detailedInfo`
- `fields`
- `requiresAuth`
- `slaHours`

### Solicitações

Entidade `ServiceRequest`:
- `id`
- `protocol`
- `status`
- `origin`
- `description`
- `createdAt`
- `updatedAt`
- `resolvedAt`
- `slaDeadline`
- `slaBreached`
- `service`
- `user`
- `department`
- `address`
- `attachments`
- `history`
- `comments`

### Usuário autenticado

Entidade `CurrentUser`:

```json
{
  "user": {
    "id": "usr_1",
    "name": "Nome",
    "email": "mail@exemplo.com",
    "cpf": "00000000000",
    "role": "ADMIN"
  }
}
```

## Regras adotadas no frontend

- toda tela admin exige token bearer
- `401` limpa a sessão local
- exportação CSV usa `fetch` com header `Authorization`
- o navegador não recebe `clientSecret` nem token de service account
- páginas de catálogo deixaram de ter fallback em arquivo estático
- não existe mais acesso local a banco dentro deste repositório

## Pendências do backend

Antes de considerar o contrato fechado, vale alinhar estes pontos no backend:

- garantir resposta consistente com `success`, `data`, `error`
- garantir que os endpoints admin aceitam bearer token
- aceitar `x-service-authorization` como credencial técnica do web BFF
- formalizar shape de `detailedInfo` e `fields`
- decidir se FAQ terá rota admin própria ou continuará read-only no frontend
- definir estratégia oficial de refresh token

## Arquivos do frontend ligados a esse contrato

- [src/lib/api.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/lib/api.ts)
- [src/app/auth/page.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/auth/page.tsx)
- [src/components/auth/PhizLogin.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/components/auth/PhizLogin.tsx)
- [src/components/admin/AdminGuard.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/components/admin/AdminGuard.tsx)
- [src/app/api/v1/[...path]/route.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/api/v1/[...path]/route.ts)
- [src/lib/server/service-account.ts](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/lib/server/service-account.ts)
