# Copa 2026 — Backend API

Proxy com cache para a football-data.org. Hospedado na Vercel.

## Endpoints

| Rota | Cache | Descrição |
|------|-------|-----------|
| `GET /api/matches` | 30s (live) / 5min | Live, hoje, próximos, recentes |
| `GET /api/standings` | 5min | Tabela de grupos |

## Deploy na Vercel

### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

### 2. Fazer login
```bash
vercel login
```

### 3. Deploy (dentro da pasta backend/)
```bash
cd backend
vercel --prod
```

### 4. Configurar variável de ambiente na Vercel
No dashboard da Vercel → Settings → Environment Variables:
```
FOOTBALL_API_KEY = sua_chave_aqui
```

### 5. Atualizar o app com a URL gerada
No arquivo `.env` do app (pasta raiz):
```
EXPO_PUBLIC_BACKEND_URL=https://seu-projeto.vercel.app
```

## Dev local

```bash
cp .env.example .env.local
# preencha FOOTBALL_API_KEY no .env.local
npm run dev
# API disponível em http://localhost:3001
```
