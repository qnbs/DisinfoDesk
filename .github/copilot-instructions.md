# Copilot Instructions for DisinfoDesk

## Architecture Overview
**Root-level React 19 + TypeScript + Vite SPA** (no `src/` directory). Entry flow: `index.tsx` → `App.tsx` → `components/Layout.tsx`.
- **Routing**: Hash-based (`createHashRouter`) for GitHub Pages deep-link compatibility.
- **Shell**: `Layout.tsx` manages navigation, online/offline state, service worker UX, and `syncStaticData()` on startup.
- **State**: Redux Toolkit-first with typed hooks; RTK Query (`store/api/aiApi.ts`) wraps AI calls.
- **Storage**: IndexedDB (via `dbService.ts`) with `redux-persist` adapter; all persisted fields must be whitelisted in `store/store.ts`.

## Critical Boundaries (Non-Negotiable)
- **No direct `@google/genai` in components/slices**: all Gemini calls route through `services/geminiService.ts`.
- **Multi-provider AI**: `AIProvider` type (`'gemini' | 'xai' | 'anthropic' | 'ollama'`) in `types/state.ts`. Provider selection stored in `settings.aiProvider`. Non-Gemini calls route through `services/aiProviderService.ts`.
- **No build-time API key injection**: keys are runtime-only, set via `Settings.tsx` + `secureApiKeyService.ts` (AES-256-GCM encrypted in IndexedDB KeyVault).
- **GitHub Pages compatibility**: maintain `vite.config.ts` dynamic `base`, hash routes, and `404.html` redirect fallback.
- **Persist whitelist versioning**: when adding persisted fields, bump `version` in `store/store.ts` persist config and add the field to `whitelist` array.

## AI Provider Architecture

### Provider Routing
- **Gemini**: `@google/genai` SDK via `services/geminiService.ts`. Models: `gemini-3.1-flash`, `gemini-3.1-pro`, `gemini-3.1-flash-image`.
- **xAI Grok**: OpenAI-compatible API via `services/aiProviderService.ts`. Models: `grok-3-mini`, `grok-3`.
- **Anthropic Claude**: Native Messages API via `services/aiProviderService.ts`. Models: `claude-sonnet-4`, `claude-opus-4`.
- **Ollama (Local)**: OpenAI-compatible API at configurable endpoint (`settings.ollamaEndpoint`). Models: `llama3.2`, `mistral`, `gemma2`, `phi3`.

### Key Management
- `secureApiKeyService.ts` stores per-provider keys: `gemini_api_key`, `xai_api_key`, `anthropic_api_key`.
- Validation per provider: Gemini=`AIza*`, xAI=`xai-*`, Anthropic=`sk-ant-*`.
- Ollama needs no key, only endpoint URL.
- Methods: `setProviderKey(provider, key)`, `getProviderKey(provider)`, `hasProviderKey(provider)`, `clearProviderKey(provider)`.

## State Management & Data Patterns

### Redux Slices & Adapters
- Always use `useAppDispatch` / `useAppSelector` from `store/hooks.ts` (typed wrappers).
- **`theoriesSlice`** uses `createEntityAdapter` with **dual language stores**: `entitiesDe` and `entitiesEn` (normalized, sorted by popularity).
- **`syncStaticData()`** replaces static theories while preserving `isUserCreated` records—call in `Layout.tsx` on mount.
- **Undo/redo**: `redux-undo` wraps only `simulation` reducer (limit: 50 frames, excludes `resetParams` action).

### RTK Query & AI Caching
- Endpoints use `fakeBaseQuery` + `queryFn` wrapper around `geminiService` functions.
- Cache tags: `Analysis` (by theory ID + language), `Image`, `Satire`. Use `keepUnusedDataFor: 600`.

### Defensive Output Parsing
- `geminiService` includes `cleanJsonOutput()` and `flattenToString()`.
- Always wrap AI responses in try-catch.

## Component & UI Conventions

### Adding a New Page
1. **Route**: lazy import + route in `App.tsx`.
2. **Navigation**: `NavItem` in `Layout.tsx` (icon, path, i18n key).
3. **Translations**: EN/DE strings in `utils/translations.ts` (cyber-terminal tone).
4. **Base components**: use `components/ui/Common.tsx` (`PageHeader`, `PageFrame`, `Button`, `Card`, `Badge`, `Skeleton`).

### Performance Patterns
- Memoize backgrounds with `React.memo`. Lazy load routes. `useMemo` for expensive selectors.
- Canvas animations: `IntersectionObserver` to pause off-screen.

### Accessibility
- Chat log: `<div role="log" aria-live="polite">`. `:focus-visible` ring. `prefers-reduced-motion` respected.

## Build, Test & CI/CD

### Dev Commands
- `npm ci && npm run dev`: Vite on port 3000 (host 0.0.0.0).
- `npm run lint` (max 300 warnings), `npm run typecheck` (non-blocking).
- `npm run test:ci`: vitest single-run. `npm run build` → `npm run preview`.

### Vite Config
- Dynamic `base` for GitHub Pages. Manual chunks: `vendor-react`, `vendor-ai`, `vendor-charts`, `vendor-icons`, `vendor-pdf`.

### CI/CD Pipeline
- Lint → Typecheck (warn) → Tests → Build → Lighthouse → Deploy (main only).
- TypeScript excludes `vitest.config.ts` and `vitest.setup.ts` via `tsconfig.json`.

## Service Worker & PWA
- Images: Cache-First (120 entries, 60-day TTL). Fonts: Cache-First (1-year). JS/CSS: Stale-While-Revalidate. API: Network-First.
- Increment `CACHE_SUFFIX` in `sw.js` to force cache purge on deploy.
- Registration in `Layout.tsx` with update banner UX via `postMessage({ type: 'SKIP_WAITING' })`.

## Data Storage & Security
- **IndexedDB** (`dbService.ts`): analyses, chats, satires, app state, binary blobs. Gzip compression + AES-GCM encryption.
- **API Keys** (`secureApiKeyService.ts`): dedicated IndexedDB KeyVault, AES-256-GCM per-provider. Never localStorage.

## File Organization
- **`store/store.ts`**: Redux store, persist whitelist, middleware.
- **`services/geminiService.ts`**: Gemini AI logic (analysis, chat, image, live session).
- **`services/aiProviderService.ts`**: xAI/Claude/Ollama abstraction (OpenAI-compatible + Anthropic native API).
- **`services/secureApiKeyService.ts`**: Multi-provider encrypted key storage.
- **`services/dbService.ts`**: IndexedDB schema, compression, encryption.
- **`components/Layout.tsx`**: App shell, nav, SW registration.
- **`components/ui/Common.tsx`**: Reusable UI primitives.
- **`utils/translations.ts`**: EN/DE strings.
- **`config/system.ts`**: Default settings, app config, model defaults.
- **`types/state.ts`**: `AIProvider`, `AppSettings`, and all state types.
