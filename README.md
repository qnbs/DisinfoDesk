<div align="center">
<pre>
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ ╔════════════════════════════════════════════════════════════════════════════════╗ ░
░ ║ ░▒▓█  D I S I N F O D E S K  ·  M E D I A  L I T E R A C Y  H U B  █▓▒░    ║ ░
░ ╚════════════════════════════════════════════════════════════════════════════════╝ ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
</pre>
</div>

<p align="center">
  <a href="#-english">🇬🇧 English</a> · <a href="#-deutsch">🇩🇪 Deutsch</a>
</p>

<p align="center">
  <a href="https://github.com/qnbs/DisinfoDesk/actions/workflows/ci-cd.yml"><img src="https://github.com/qnbs/DisinfoDesk/actions/workflows/ci-cd.yml/badge.svg?branch=main" alt="CI/CD"></a>
  <a href="https://github.com/qnbs/DisinfoDesk/actions/workflows/e2e.yml"><img src="https://github.com/qnbs/DisinfoDesk/actions/workflows/e2e.yml/badge.svg?branch=main" alt="E2E"></a>
  <a href="https://github.com/qnbs/DisinfoDesk/blob/main/LICENSE"><img src="https://img.shields.io/github/license/qnbs/DisinfoDesk?color=00e5ff&style=flat-square" alt="MIT"></a>
  <img src="https://img.shields.io/badge/React-19-00d8ff?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript" alt="TS">
  <img src="https://img.shields.io/badge/PWA-Offline--Ready-ff6f00?style=flat-square" alt="PWA">
</p>

---

# 🇬🇧 English

## What is DisinfoDesk?

A **Progressive Web App** for analyzing disinformation, conspiracy theories, and dangerous narratives using multi-provider AI. Built as an offline-first SPA with client-side encryption and zero server-side storage.

**[Live Demo →](https://qnbs.github.io/DisinfoDesk/)**

### Features

| Category | Highlights |
|---|---|
| **Analysis** | 200+ pre-loaded conspiracy theories across 7 categories, dual-language (EN/DE), custom theory editor |
| **AI Providers** | Google Gemini (3.1 Flash/Pro), xAI Grok (3 Mini/3), Anthropic Claude (Sonnet/Opus 4), Ollama (local LLMs) |
| **Chat** | Context-aware debunk chat with Dr. Veritas AI, streaming responses, conversation history |
| **Simulation** | Real-time virality simulation via Web Workers, force-directed network graph (D3.js), undo/redo timeline |
| **Media Library** | 100+ media sources with reliability scoring, bias classification, 50+ author profiles |
| **Security** | AES-256-GCM client-side encryption, dedicated IndexedDB KeyVault, XSS prevention, rate limiting |
| **PWA** | Service Worker with cache strategies, installable, offline-first, cross-tab sync |

### Tech Stack

React 19 · TypeScript 5.8 · Vite 6 · Redux Toolkit (RTK Query, redux-persist, redux-undo) · IndexedDB (Web Crypto, Compression Streams) · Web Workers · D3.js · Recharts

### AI Provider Setup

| Provider | Key Format | Where to get |
|---|---|---|
| **Google Gemini** | `AIza...` | [Google AI Studio](https://aistudio.google.com/apikey) |
| **xAI Grok** | `xai-...` | [xAI Console](https://console.x.ai/) |
| **Anthropic Claude** | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) |
| **Ollama (Local)** | No key needed | [ollama.com](https://ollama.com/) – set endpoint URL |

All keys are stored encrypted (AES-256-GCM) in a dedicated IndexedDB KeyVault. Never in source code, `.env`, or localStorage.

### Quick Start

```bash
git clone https://github.com/qnbs/DisinfoDesk.git
cd DisinfoDesk
npm ci
npm run dev        # → http://localhost:3000
```

Configure your AI provider API key in **Settings → Privacy & Data**.

### Commands

```bash
npm run dev          # Dev server (Vite HMR)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test:ci      # Unit tests (Vitest)
npm run e2e          # E2E tests (Playwright)
```

### Project Structure

```
DisinfoDesk/
├── components/        # React pages & UI components
├── services/          # AI, DB, crypto, share, PDF services
│   ├── geminiService.ts        # Google Gemini SDK integration
│   ├── aiProviderService.ts    # xAI / Claude / Ollama abstraction
│   ├── secureApiKeyService.ts  # Multi-provider encrypted key storage
│   └── dbService.ts            # IndexedDB with encryption + compression
├── store/             # Redux slices, RTK Query, middleware
├── utils/             # i18n, security, helpers
├── hooks/             # Custom React hooks
├── data/              # Static theory/media/author datasets
├── config/            # App config, theme, defaults
├── types/             # TypeScript type definitions
└── sw.js              # Service Worker (PWA caching)
```

### Deployment

Automated via GitHub Actions: Lint → Typecheck → Tests → Build → Lighthouse → Deploy to GitHub Pages (main branch).

### Contributing

1. Fork → feature branch → make changes
2. `npm run lint && npm run test:ci && npm run e2e`
3. PR with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)

### License

[MIT](LICENSE)

---

# 🇩🇪 Deutsch

## Was ist DisinfoDesk?

Eine **Progressive Web App** zur Analyse von Desinformation, Verschwörungstheorien und gefährlichen Narrativen mithilfe meherer KI-Anbieter. Offline-first SPA mit clientseitiger Verschlüsselung und ohne serverseitige Datenspeicherung.

**[Live-Demo →](https://qnbs.github.io/DisinfoDesk/)**

### Funktionen

| Kategorie | Highlights |
|---|---|
| **Analyse** | 200+ vorgeladene Verschwörungstheorien in 7 Kategorien, zweisprachig (EN/DE), eigener Theorie-Editor |
| **KI-Anbieter** | Google Gemini (3.1 Flash/Pro), xAI Grok (3 Mini/3), Anthropic Claude (Sonnet/Opus 4), Ollama (lokale LLMs) |
| **Chat** | Kontextbezogener Debunk-Chat mit Dr. Veritas KI, Streaming-Antworten, Konversationsverlauf |
| **Simulation** | Echtzeit-Viralitätssimulation über Web Workers, Force-Directed-Graph (D3.js), Undo/Redo |
| **Medienbibliothek** | 100+ Medienquellen mit Zuverlässigkeitsbewertung, Bias-Klassifikation, 50+ Autorenprofile |
| **Sicherheit** | AES-256-GCM clientseitige Verschlüsselung, IndexedDB-KeyVault, XSS-Prävention, Rate-Limiting |
| **PWA** | Service Worker mit Cache-Strategien, installierbar, offline-first, Tab-übergreifende Synchronisation |

### KI-Anbieter einrichten

| Anbieter | Key-Format | Bezugsquelle |
|---|---|---|
| **Google Gemini** | `AIza...` | [Google AI Studio](https://aistudio.google.com/apikey) |
| **xAI Grok** | `xai-...` | [xAI Console](https://console.x.ai/) |
| **Anthropic Claude** | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) |
| **Ollama (Lokal)** | Kein Key nötig | [ollama.com](https://ollama.com/) – Endpoint-URL konfigurieren |

Alle Keys werden verschlüsselt (AES-256-GCM) in einem dedizierten IndexedDB-KeyVault gespeichert.

### Schnellstart

```bash
git clone https://github.com/qnbs/DisinfoDesk.git
cd DisinfoDesk
npm ci
npm run dev        # → http://localhost:3000
```

KI-Anbieter-API-Key unter **Einstellungen → Datenschutz & Daten** konfigurieren.

### Lizenz

[MIT](LICENSE)

---

<p align="center"><sub>DisinfoDesk – Media Literacy Research & Analysis Hub</sub></p>
