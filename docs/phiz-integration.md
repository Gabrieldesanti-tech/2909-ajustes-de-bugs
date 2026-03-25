# Integracao Phiz

## Visao Geral

O frontend usa a integracao Phiz apenas como consumidor de API externa.

O backend responsavel pelo fluxo deve expor os endpoints abaixo:

- `POST /api/v1/integrations/phiz/qrcode`
- `GET /api/v1/integrations/phiz/check-scan?token=...`
- `POST /api/v1/integrations/phiz/login`
- `POST /api/v1/integrations/phiz/link`
- `POST /api/v1/integrations/phiz/sync-user`

## Fluxo de Login por QR Code

1. O frontend solicita um QR code.
2. O backend responde com a URL do QR e um `scanToken`.
3. O frontend faz polling do status.
4. Quando o scan for concluido, o frontend chama o endpoint de login.
5. O backend devolve um `accessToken` e, idealmente, os dados do usuario.

## Contratos Esperados

### Gerar QR Code

`POST /api/v1/integrations/phiz/qrcode`

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "qrcodeUrl": "https://...",
    "scanToken": "uuid",
    "expiresIn": 300
  }
}
```

### Polling de status

`GET /api/v1/integrations/phiz/check-scan?token={scanToken}`

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "status": "PENDING"
  }
}
```

Ou:

```json
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "phizUserId": "phiz_123"
  }
}
```

### Login

`POST /api/v1/integrations/phiz/login`

Payload:

```json
{
  "scanToken": "uuid"
}
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt-refresh",
    "user": {
      "id": "usr_1",
      "name": "Nome",
      "email": "mail@exemplo.com",
      "cpf": "00000000000",
      "role": "CITIZEN"
    }
  }
}
```

### Vinculo de conta

`POST /api/v1/integrations/phiz/link`

Payload:

```json
{
  "scanToken": "uuid"
}
```

### Sync de usuario

`POST /api/v1/integrations/phiz/sync-user`

Payload exemplo:

```json
{
  "userId": "phiz_user_id",
  "nickname": "apelido",
  "avatarUrl": "https://..."
}
```

## Arquivos do frontend ligados ao fluxo

- [src/components/auth/PhizLogin.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/components/auth/PhizLogin.tsx)
- [src/app/phiz/page.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/phiz/page.tsx)
- [src/app/Baixe(ouvidoria)/page.tsx](/Users/kauehmoreno/devops/rkj/2909-ajustes-de-bugs/src/app/Baixe(ouvidoria)/page.tsx)
