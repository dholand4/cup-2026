# cup-2026

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/styled--components-6.x-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Navigation-6.x-6B52AE?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-14.x-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

> Aplicativo mobile para acompanhar a Copa do Mundo FIFA 2026 — jogos ao vivo, tabela de grupos, palpites por placar, bracket da fase final e notificações push para times favoritos. Disponível para Android e iOS via Expo.

---

## Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Como rodar](#-como-rodar)
- [Backend (Vercel)](#-backend-vercel)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Gerar APK](#-gerar-apk)
- [Scripts disponíveis](#-scripts-disponíveis)

---

## 📖 Sobre

O **cup-2026** é um app mobile de acompanhamento da Copa do Mundo 2026. O usuário acompanha os jogos em tempo real, consulta a tabela de grupos, registra palpites de placar antes dos jogos e monta seu bracket da fase eliminatória. É possível favoritar seleções e receber notificações push no início, intervalo e encerramento de cada partida.

Os dados são consumidos via backend próprio hospedado na Vercel — um proxy com cache inteligente sobre a [football-data.org](https://www.football-data.org/) — reduzindo requisições e permitindo escalar para múltiplos usuários sem estourar a API.

---

## ✨ Funcionalidades

**Jogos (HomeScreen)**
- ⚽ Cards de jogos ao vivo com placar e minuto em tempo real
- 📅 Navegação por data com agrupamento por dia
- 🔔 Botão de notificações com modal de configuração
- ⭐ Filtro **Todos | Favoritos** para ver só os jogos dos times favoritos
- 🔄 Atualização automática — 30s com jogo ao vivo, 5min sem jogos

**Grupos (GroupsScreen)**
- 🏆 Tabela de classificação dos 12 grupos da fase de grupos
- 📊 Pontos, vitórias, saldo de gols e aproveitamento por seleção

**Palpites (PalpitesScreen)**
- 🎯 Palpite de placar por jogo — bloqueado assim que o jogo começa
- 🏅 Sistema de pontuação: +3pts placar exato · +1pt vencedor certo
- 🗂️ Bracket da fase final — preencher antes do fim da fase de grupos
- 🔒 Slots do bracket permanentes após preenchidos
- ✅ Indicadores de resultado: verde (acertou) / vermelho (errou) / cadeado (aguardando)
- 📄 Paginação por data (2 dias por página)

**Notificações push**
- 🔔 Notificar todos os jogos ou apenas times favoritos
- ▶️ Jogo Começou! ⚽ — ao iniciar
- ⏸ Intervalo ⏸ — ao pausar
- 🏁 Jogo Encerrado! 🏁 com placar final — ao encerrar
- ⚡ Ao Vivo Agora! ⚽ — para jogos já em andamento ao ativar notificações

**Favoritos**
- ⭐ Favoritar/desfavoritar times com persistência local
- Gerenciamento direto no modal de notificações

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│         App Mobile (React Native + Expo)    │
│  HomeScreen      → Jogos ao vivo e agenda   │
│  GroupsScreen    → Tabela de grupos         │
│  PalpitesScreen  → Palpites e bracket       │
└─────────────────────┬───────────────────────┘
                      │ HTTP (EXPO_PUBLIC_BACKEND_URL)
┌─────────────────────▼───────────────────────┐
│         Backend Next.js (Vercel)            │
│  GET /api/matches   → jogos (cache 30s/5m)  │
│  GET /api/standings → grupos (cache 5min)   │
└─────────────────────┬───────────────────────┘
                      │ REST + API Key
┌─────────────────────▼───────────────────────┐
│         football-data.org                   │
│  Dados oficiais da Copa 2026                │
└─────────────────────────────────────────────┘
```

### Estrutura de pastas

```
cup-2026/
├── App.tsx                        # Entry point — providers e versionamento do storage
├── app.json                       # Configuração Expo (ícone, splash, plugins)
├── eas.json                       # Perfis de build EAS (preview APK / production)
├── backend/
│   ├── pages/api/
│   │   ├── matches.ts             # GET /api/matches com cache inteligente
│   │   └── standings.ts           # GET /api/standings
│   ├── lib/
│   │   └── football.ts            # Client football-data.org
│   ├── vercel.json                # Região gru1 (São Paulo)
│   └── .env.example               # FOOTBALL_API_KEY
└── src/
    ├── @types/                    # IMatch, IStandings e tipos globais
    ├── assets/                    # Logo e imagens
    ├── constants/                 # Tema de cores e tokens
    ├── hooks/
    │   ├── useMatches.ts          # Fetch unificado com intervalo dinâmico
    │   ├── useStandings.ts        # Tabela de grupos
    │   ├── usePalpites.ts         # CRUD de palpites e bracket (AsyncStorage)
    │   ├── useFavorites.ts        # Times favoritos (AsyncStorage)
    │   ├── useNotificationSettings.ts  # Toggles de notificação
    │   └── useMatchNotifications.ts    # Disparo de notificações por status
    ├── providers/
    │   ├── ThemeProvider.tsx      # Tema styled-components
    │   ├── MatchesProvider.tsx    # Instância única de useMatches
    │   ├── FavoritesProvider.tsx  # Contexto de favoritos
    │   ├── NotifSettingsProvider.tsx   # Contexto de notificações
    │   └── TooltipProvider.tsx    # Tooltips globais
    ├── services/
    │   ├── footballService.ts     # Chamadas ao backend (com fallback direto)
    │   └── cacheService.ts        # Cache local de respostas
    ├── components/
    │   ├── matchCardGlobal/       # Card grande de jogo ao vivo
    │   ├── matchRowGlobal/        # Linha de jogo na lista
    │   ├── groupTableGlobal/      # Tabela de classificação de grupo
    │   ├── crestGlobal/           # Escudo das seleções
    │   ├── notifModalGlobal/      # Modal de configurações de notificação
    │   ├── liveBadgeGlobal/       # Badge "AO VIVO"
    │   ├── emptyStateGlobal/      # Estado vazio genérico
    │   └── searchBarGlobal/       # Barra de busca
    ├── routes/
    │   ├── index.tsx              # Tab navigator (Grupos | Jogos | Palpites)
    │   └── types.ts               # RootStackParamList tipado
    ├── utils/
    │   ├── dateUtils.ts           # Formatação de datas em pt-BR
    │   ├── teamNames.ts           # Nomes completos das seleções
    │   ├── allTeams.ts            # Lista das 48 seleções
    │   ├── mockMatches.ts         # Dados de teste (vazio em produção)
    │   └── mockPalpites.ts        # Dados de teste (vazio em produção)
    └── view/
        ├── homeScreen/            # Tela de jogos
        ├── groupsScreen/          # Tela de grupos
        ├── palpitesScreen/        # Tela de palpites e bracket
        └── scoresScreen/          # Tela de placares
```

---

## 🛠️ Tecnologias

### Mobile
| Tecnologia | Uso |
|------------|-----|
| React Native 0.81.5 + Expo SDK 54 | Base do aplicativo iOS/Android |
| TypeScript 5.9 | Tipagem estática |
| styled-components v6 | Estilização com tema de tokens |
| React Navigation 6 | Tab navigator e navegação entre telas |
| expo-notifications | Notificações push locais |
| AsyncStorage | Persistência de favoritos, palpites e bracket |
| dayjs | Manipulação de datas |
| Expo Google Fonts (Anton + Manrope) | Tipografia |

### Backend
| Tecnologia | Uso |
|------------|-----|
| Next.js 14 (Pages Router) | API Routes serverless |
| Vercel (região gru1) | Hospedagem e CDN cache |
| football-data.org | Fonte dos dados da Copa 2026 |

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 20+
- npm 10+
- App **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) — ou emulador configurado

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/cup-2026.git
cd cup-2026

# Instalar dependências
npm install

# Configurar variável de ambiente
cp .env.example .env
# Edite o .env com a URL do backend (veja seção abaixo)

# Iniciar o servidor Expo
npx expo start
```

Escaneie o QR Code com o Expo Go ou pressione `a` (Android) / `i` (iOS) para abrir no emulador.

> **Rede diferente?** Use túnel para acessar de outra rede:
> ```bash
> npx expo start --tunnel
> ```

---

## ☁️ Backend (Vercel)

O backend é um proxy Next.js que consome a football-data.org e distribui os dados com cache — evitando estourar a cota da API gratuita mesmo com muitos usuários simultâneos.

| Rota | Cache | Descrição |
|------|-------|-----------|
| `GET /api/matches` | 30s (com jogo ao vivo) / 5min | Jogos ao vivo, hoje, próximos e recentes |
| `GET /api/standings` | 5min | Tabela de grupos |

### Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Entrar na pasta do backend
cd backend

# Deploy
vercel --prod
```

Depois do deploy, acesse o dashboard da Vercel → **Settings → Environment Variables** e adicione:

```
FOOTBALL_API_KEY = sua_chave_aqui
```

Obtenha sua chave gratuita em [football-data.org](https://www.football-data.org/client/register).

### Dev local do backend

```bash
cd backend
cp .env.example .env.local
# Preencha FOOTBALL_API_KEY no .env.local
npm run dev
# API disponível em http://localhost:3001
```

---

## ⚙️ Variáveis de ambiente

### App mobile — `.env`

```env
# URL do backend Vercel (deixe vazio para chamar a football-data.org diretamente)
EXPO_PUBLIC_BACKEND_URL=https://seu-projeto.vercel.app
```

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `EXPO_PUBLIC_BACKEND_URL` | ❌ | URL do backend Vercel. Se vazio, chama a API diretamente |

### Backend — `.env.local`

```env
FOOTBALL_API_KEY=sua_chave_aqui
```

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `FOOTBALL_API_KEY` | ✅ | Chave da football-data.org |

---

## 📦 Gerar APK

O app usa [EAS Build](https://docs.expo.dev/build/introduction/) para gerar os binários na nuvem — sem precisar de Android Studio ou Xcode instalado.

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Gerar APK para testes (perfil preview)
eas build --platform android --profile preview
```

Ao finalizar, a Expo envia o link para download do `.apk` diretamente no terminal.

### Perfis de build disponíveis

| Perfil | Formato | Uso |
|--------|---------|-----|
| `preview` | `.apk` | Testes em dispositivo físico |
| `production` | `.apk` / `.aab` | Publicação na Play Store |

---

## 📋 Scripts disponíveis

### Mobile

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor Expo (QR Code) |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm test` | Executa os testes com Jest |
| `eas build --profile preview` | Gera APK para testes |
| `eas build --profile production` | Gera build de produção |
| `eas update` | Publica atualização OTA (sem novo build) |

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor local na porta 3001 |
| `npm run build` | Build de produção Next.js |
| `vercel --prod` | Deploy na Vercel |
