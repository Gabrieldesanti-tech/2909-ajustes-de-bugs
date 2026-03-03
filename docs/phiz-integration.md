# Integração Phiz - Guia Técnico

## Visão Geral

O Portal 2909 integra-se à plataforma Phiz para permitir login via QR code e sincronização de identidade entre o site e o mini-programa Phiz.

**Fluxo de integração (conforme Open Platform Integration Guide):**

1. Submeter informações do site (URL, nome, logo) para aprovação pela Phiz
2. Após aprovação, integrar a API de login por QR code
3. Receber `userId` no callback quando o usuário escanear o QR
4. Usar `getPhizUserInfo` no mini-programa para obter dados e enviar ao backend

## APIs Implementadas

### 1. Gerar QR Code de Login

**Endpoint:** `POST /api/v1/phiz/qrcode`

**Descrição:** Chama a API Phiz para gerar um QR code e cria uma sessão local para rastrear o escaneamento.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "qrcode_url": "https://...",
    "scan_token": "uuid",
    "expire_time": 300
  }
}
```

### 2. Callback (Phiz chama quando usuário escaneia)

**Endpoint:** `GET|POST /api/v1/phiz/callback?token={scanToken}&userId={phizUserId}`

**Descrição:** Recebido automaticamente pela plataforma Phiz. Atualiza a sessão com o `phizUserId`.

**Suporta:**
- GET: `?token=xxx&userId=xxx`
- POST: body `{ "userId": "xxx" }` + `?token=xxx`

### 3. Verificar Escaneamento (Polling)

**Endpoint:** `GET /api/v1/phiz/check-scan?token={scanToken}`

**Descrição:** Polling pelo frontend para saber quando o usuário escaneou.

**Resposta:**
```json
{
  "success": true,
  "status": "PENDING" | "COMPLETED" | "EXPIRED",
  "phiz_user_id": "xxx"  // presente quando status === "COMPLETED"
}
```

### 4. Login via Phiz

**Endpoint:** `POST /api/v1/phiz/login`

**Body:**
```json
{ "scan_token": "uuid" }
```

**Descrição:** Após o QR ser escaneado, chama este endpoint para criar sessão. Funciona apenas se existir um `User` com `phizUserId` correspondente (conta vinculada).

**Códigos de erro:**
- `PHIZ_NOT_LINKED`: Conta Phiz não vinculada. Usuário deve cadastrar no portal e vincular.

### 5. Vincular Conta Phiz (usuário autenticado)

**Endpoint:** `POST /api/v1/phiz/link`

**Body:**
```json
{ "scan_token": "uuid" }
```

**Descrição:** Vincula a conta Phiz ao usuário logado. Requer autenticação.

### 6. Sync de Usuário (Mini-Programa)

**Endpoint:** `POST /api/v1/phiz/sync-user`

**Body:**
```json
{
  "userId": "phiz_user_id",
  "nickname": "opcional",
  "avatarUrl": "opcional"
}
```

**Descrição:** Chamado pelo mini-programa após `wx.getPhizUserInfo()`. Retorna dados do usuário vinculado ou indica que a conta não está vinculada.

## Banco de Dados

- **User.phizUserId**: Campo opcional para vincular o usuário portal ao Phiz.
- **PhizLoginSession**: Tabela para sessões de login via QR (scanToken, phizUserId, status, expiresAt).

## Configuração

### Callback URL

A URL de callback é construída automaticamente com base em:
- `x-forwarded-host` / `host` (headers da requisição)
- `x-forwarded-proto` / `http` (protocolo)
- Ou `NEXT_PUBLIC_APP_URL` (fallback para produção)

**Importante:** A URL de callback deve ser acessível publicamente. Em desenvolvimento local, considere usar ngrok ou similar.

### URL Base (Produção)

Defina `NEXT_PUBLIC_APP_URL` no `.env` para produção, por exemplo:
```
NEXT_PUBLIC_APP_URL=https://2909.belfordroxo.rj.gov.br
```

## Fluxo de Login via QR

1. Usuário clica em "Entrar com Phiz (QR Code)"
2. Frontend chama `POST /api/v1/phiz/qrcode`
3. Exibe o QR code (`qrcode_url`)
4. Polling em `GET /api/v1/phiz/check-scan?token=xxx` a cada 2 segundos
5. Quando Phiz chama o callback, a sessão é atualizada
6. Frontend detecta `status === "COMPLETED"` no próximo poll
7. Frontend chama `POST /api/v1/phiz/login` com `scan_token`
8. Se usuário vinculado → sessão criada e redirect. Se não → mensagem para vincular conta.

## Vincular Conta Phiz

1. Usuário cadastra no portal (CPF, senha, etc.)
2. Faz login normalmente
3. Acessa área de "Minha Conta" ou "Vincular Phiz" (a implementar)
4. Escaneia QR code → callback recebe phizUserId
5. Chama `POST /api/v1/phiz/link` com scan_token → vincula `User.phizUserId`

## Mini-Programa (WeChat/Phiz)

No mini-programa, após `wx.getPhizUserInfo()`:

```javascript
const userInfo = await wx.getPhizUserInfo();
const response = await fetch('https://seu-site.com/api/v1/phiz/sync-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userInfo.userId,
    nickname: userInfo.nickname,
    avatarUrl: userInfo.avatarUrl
  })
});
```
