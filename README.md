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
  <img src="https://img.shields.io/badge/Vite-6.2-646cff?style=flat-square&logo=vite" alt="Vite 6">
  <img src="https://img.shields.io/badge/Tailwind-4.2-06b6d4?style=flat-square&logo=tailwindcss" alt="Tailwind 4">
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
| **Analysis** | 200+ pre-loaded conspiracy theories across 7 categories, dual-language (EN/DE), custom theory editor, fact-check wizard with PDF export |
| **AI Providers** | Google Gemini (3.1 Flash/Pro), xAI Grok (3 Mini/3), Anthropic Claude (Sonnet/Opus 4), Ollama (local LLMs), Chrome Built-in AI (on-device) |
| **Chat** | Context-aware debunk chat with Dr. Veritas AI, streaming responses, conversation history, live sessions |
| **Simulation** | Real-time virality simulation via Web Workers, force-directed network graph (D3.js), undo/redo timeline (50 frames) |
| **Media Library** | 100+ media sources with reliability scoring, bias classification, 50+ author profiles with network visualization |
| **Satire Lab** | AI-powered satirical content generator with classified/darknet/tabloid output formats |
| **Security** | AES-256-GCM encryption + SHA-256 integrity verification, CSP headers, age-gate, AI disclaimers, privacy policy |
| **PWA** | Service Worker with tiered cache strategies, installable, offline-first, responsive mobile-first UI |

### Security Architecture

DisinfoDesk implements defense-in-depth security:

| Layer | Implementation |
|---|---|
| **API Key Encryption** | AES-256-GCM via Web Crypto API in dedicated IndexedDB KeyVault |
| **Key Integrity** | SHA-256 HMAC verification on wrapping key — tamper detection |
| **CSP (Production)** | Strict Content Security Policy injected at build time via Vite plugin |
| **Permissions Policy** | Camera, microphone, geolocation, payment APIs all disabled |
| **HTTP Headers** | X-Frame-Options DENY, X-Content-Type-Options nosniff, strict referrer, upgrade-insecure-requests |
| **DNS Security** | X-DNS-Prefetch-Control off, X-Permitted-Cross-Domain-Policies none |
| **Age Verification** | Mandatory age-gate (16+) during onboarding — cannot be skipped |
| **Privacy Consent** | Mandatory privacy policy acceptance before first use |
| **AI Disclaimers** | Every AI-generated response includes a bilingual disclaimer (education-only, verify independently) |
| **Data Storage** | 100% client-side — no cookies, no localStorage for sensitive data, no trackers, no analytics |
| **Input Validation** | Per-provider API key format validation (Gemini=`AIza*`, xAI=`xai-*`, Anthropic=`sk-ant-*`) |

### Tech Stack

React 19 · TypeScript 5.8 · Vite 6.2 (SWC) · Tailwind CSS 4.2 · Redux Toolkit (RTK Query, redux-persist, redux-undo) · IndexedDB (Web Crypto, Compression Streams) · Web Workers · D3.js · Recharts · Playwright · Vitest

### AI Provider Setup

| Provider | Key Format | Where to get | Models |
|---|---|---|---|
| **Google Gemini** | `AIza...` | [Google AI Studio](https://aistudio.google.com/apikey) | gemini-3.1-flash, gemini-3.1-pro |
| **xAI Grok** | `xai-...` | [xAI Console](https://console.x.ai/) | grok-3-mini, grok-3 |
| **Anthropic Claude** | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) | claude-sonnet-4, claude-opus-4 |
| **Ollama (Local)** | No key needed | [ollama.com](https://ollama.com/) | llama3.2, mistral, gemma2, phi3 |
| **Chrome Built-in AI** | No key needed | Chrome 138+ with flags | Gemini Nano (on-device) |

All keys are stored encrypted (AES-256-GCM) in a dedicated IndexedDB KeyVault with SHA-256 integrity verification. Never in source code, `.env`, or localStorage.

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
npm run dev          # Dev server (Vite HMR, port 3000)
npm run build        # Production build (manual chunks, CSP injection)
npm run preview      # Preview production build
npm run lint         # ESLint (max 300 warnings)
npm run typecheck    # TypeScript strict check
npm run test:ci      # Unit tests (Vitest)
npm run e2e          # E2E tests (Playwright)
```

### Project Structure

```
DisinfoDesk/
├── components/           # React pages & UI components
│   ├── ui/Common.tsx     # Reusable primitives (Button, Card, Badge, AIDisclaimer, etc.)
│   ├── Layout.tsx        # App shell, navigation, SW registration
│   ├── OnboardingTour.tsx # 7-step onboarding (age-gate + privacy consent)
│   ├── PrivacyPolicy.tsx # Bilingual privacy policy (DE/EN)
│   └── ...               # 20+ lazy-loaded route components
├── services/
│   ├── geminiService.ts        # Google Gemini SDK integration
│   ├── aiProviderService.ts    # xAI / Claude / Ollama / Local AI abstraction
│   ├── secureApiKeyService.ts  # AES-256-GCM encryption + SHA-256 integrity
│   ├── dbService.ts            # IndexedDB with gzip + AES-GCM encryption
│   ├── pdfExportService.ts     # Fact-check report PDF generation
│   └── shareService.ts         # Shareable analysis links
├── store/
│   ├── store.ts          # Redux store, persist whitelist, middleware
│   ├── api/aiApi.ts      # RTK Query AI endpoints (fakeBaseQuery)
│   ├── slices/           # Redux slices (theories, settings, simulation, satire, etc.)
│   └── middleware/        # Error logger, state validators
├── utils/
│   ├── translations.ts   # Full EN/DE i18n strings (cyber-terminal tone)
│   ├── security.ts       # XSS prevention, input sanitization
│   └── helpers.ts        # Shared utilities
├── hooks/                # useIntersectionObserver, useOnlineStatus, useWebVitals
├── data/                 # Static theory/media/author datasets (7 categories)
├── config/               # App config, theme, default settings
├── types/                # TypeScript type definitions (state, API, UI, models)
├── workers/              # Web Worker for virality simulation
├── contexts/             # Language, Settings, Toast context providers
├── e2e/                  # Playwright E2E tests
├── __tests__/            # Vitest unit tests
├── sw.js                 # Service Worker (Cache-First/SWR/Network-First)
└── vite.config.ts        # Build config with CSP plugin, manual chunks
```

### Build Optimizations

- **Manual Chunks**: vendor-react, vendor-ai, vendor-charts, vendor-icons, vendor-pdf — parallel loading, better caching
- **Lazy Routes**: All 20+ routes lazy-loaded with `React.lazy()` + `Suspense`
- **Tree Shaking**: Dead code elimination via Vite + SWC
- **Asset Optimization**: Gzip/Brotli compression, image caching (Cache-First, 120 entries, 60-day TTL)
- **CSS**: Tailwind 4.2 with JIT compilation

### Deployment

Automated via GitHub Actions CI/CD pipeline:

1. **Lint** → ESLint with max 300 warnings
2. **Typecheck** → TypeScript strict mode (non-blocking)
3. **Tests** → Vitest unit tests
4. **Build** → Production build with CSP injection
5. **Lighthouse** → Performance audit
6. **Deploy** → GitHub Pages (main branch only)

### Contributing

1. Fork → feature branch → make changes
2. `npm run lint && npm run test:ci && npm run e2e`
3. PR with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)

### License

[MIT](LICENSE)

---

# 🇩🇪 Deutsch

## Was ist DisinfoDesk?

Eine **Progressive Web App** zur Analyse von Desinformation, Verschwörungstheorien und gefährlichen Narrativen mithilfe mehrerer KI-Anbieter. Offline-first SPA mit clientseitiger Verschlüsselung und ohne serverseitige Datenspeicherung.

**[Live-Demo →](https://qnbs.github.io/DisinfoDesk/)**

### Funktionen

| Kategorie | Highlights |
|---|---|
| **Analyse** | 200+ vorgeladene Verschwörungstheorien in 7 Kategorien, zweisprachig (EN/DE), eigener Theorie-Editor, Faktencheck-Assistent mit PDF-Export |
| **KI-Anbieter** | Google Gemini (3.1 Flash/Pro), xAI Grok (3 Mini/3), Anthropic Claude (Sonnet/Opus 4), Ollama (lokale LLMs), Chrome Built-in AI (On-Device) |
| **Chat** | Kontextbezogener Debunk-Chat mit Dr. Veritas KI, Streaming-Antworten, Konversationsverlauf, Live-Sessions |
| **Simulation** | Echtzeit-Viralitätssimulation über Web Workers, Force-Directed-Graph (D3.js), Undo/Redo (50 Frames) |
| **Medienbibliothek** | 100+ Medienquellen mit Zuverlässigkeitsbewertung, Bias-Klassifikation, 50+ Autorenprofile mit Netzwerk-Visualisierung |
| **Satire-Labor** | KI-gestützter satirischer Content-Generator mit Classified/Darknet/Tabloid-Formaten |
| **Sicherheit** | AES-256-GCM-Verschlüsselung + SHA-256-Integritätsprüfung, CSP-Headers, Age-Gate, KI-Disclaimer, Datenschutzerklärung |
| **PWA** | Service Worker mit gestaffelten Cache-Strategien, installierbar, offline-first, responsives Mobile-First-UI |

### Sicherheitsarchitektur

| Schicht | Implementierung |
|---|---|
| **API-Key-Verschlüsselung** | AES-256-GCM via Web Crypto API in dediziertem IndexedDB-KeyVault |
| **Key-Integrität** | SHA-256-HMAC-Verifikation des Wrapping-Keys — Manipulationserkennung |
| **CSP (Produktion)** | Strikte Content Security Policy, Build-Time-Injection via Vite-Plugin |
| **Permissions Policy** | Kamera, Mikrofon, Geolocation, Payment APIs deaktiviert |
| **HTTP-Headers** | X-Frame-Options DENY, X-Content-Type-Options nosniff, strikter Referrer, upgrade-insecure-requests |
| **Altersverifikation** | Obligatorisches Age-Gate (16+) im Onboarding — nicht überspringbar |
| **Datenschutz-Zustimmung** | Obligatorische Akzeptanz der Datenschutzerklärung vor erster Nutzung |
| **KI-Disclaimer** | Jede KI-generierte Antwort enthält einen zweisprachigen Haftungsausschluss |
| **Datenspeicherung** | 100% clientseitig — keine Cookies, kein localStorage für sensible Daten, keine Tracker |

### KI-Anbieter einrichten

| Anbieter | Key-Format | Bezugsquelle | Modelle |
|---|---|---|---|
| **Google Gemini** | `AIza...` | [Google AI Studio](https://aistudio.google.com/apikey) | gemini-3.1-flash, gemini-3.1-pro |
| **xAI Grok** | `xai-...` | [xAI Console](https://console.x.ai/) | grok-3-mini, grok-3 |
| **Anthropic Claude** | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) | claude-sonnet-4, claude-opus-4 |
| **Ollama (Lokal)** | Kein Key nötig | [ollama.com](https://ollama.com/) | llama3.2, mistral, gemma2, phi3 |
| **Chrome Built-in AI** | Kein Key nötig | Chrome 138+ mit Flags | Gemini Nano (On-Device) |

Alle Keys werden verschlüsselt (AES-256-GCM) mit SHA-256-Integritätsprüfung in einem dedizierten IndexedDB-KeyVault gespeichert.

### Schnellstart

```bash
git clone https://github.com/qnbs/DisinfoDesk.git
cd DisinfoDesk
npm ci
npm run dev        # → http://localhost:3000
```

KI-Anbieter-API-Key unter **Einstellungen → Datenschutz & Daten** konfigurieren.

### Befehle

```bash
npm run dev          # Dev-Server (Vite HMR, Port 3000)
npm run build        # Produktions-Build (manuelle Chunks, CSP-Injection)
npm run preview      # Produktions-Build Vorschau
npm run lint         # ESLint (max. 300 Warnungen)
npm run typecheck    # TypeScript Strict-Check
npm run test:ci      # Unit-Tests (Vitest)
npm run e2e          # E2E-Tests (Playwright)
```

### Lizenz

[MIT](LICENSE)

---

<p align="center"><sub>DisinfoDesk – Media Literacy Research & Analysis Hub</sub></p>
