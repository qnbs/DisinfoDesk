# Copilot Instructions for DisinfoDesk

## Architecture Overview
**Root-level React 19 + TypeScript + Vite SPA** (no `src/` directory). Entry flow: `index.tsx` → `App.tsx` → `components/Layout.tsx`.
- **Routing**: Hash-based (`createHashRouter`) for GitHub Pages deep-link compatibility.
- **Shell**: `Layout.tsx` manages navigation, online/offline state, service worker UX, and `syncStaticData()` on startup.
- **State**: Redux Toolkit-first with typed hooks; RTK Query (`store/api/aiApi.ts`) wraps AI calls through `services/geminiService.ts`.
- **Storage**: IndexedDB (via `dbService.ts`) with `redux-persist` adapter; all persisted fields must be whitelisted in `store/store.ts`.

## Critical Boundaries (Non-Negotiable)
- **No direct `@google/genai` in components/slices**: all Gemini calls route through `services/geminiService.ts`.
- **No build-time API key injection**: Gemini key is runtime-only, set via `components/Settings.tsx` + `services/secureApiKeyService.ts` (stored securely in IndexedDB).
- **GitHub Pages compatibility**: maintain `vite.config.ts` dynamic `base`, hash routes, and `404.html` redirect fallback.
- **Persist whitelist versioning**: when adding persisted fields, bump `version` in `store/store.ts` persist config and add the field to `whitelist` array.

## State Management & Data Patterns

### Redux Slices & Adapters
- Always use `useAppDispatch` / `useAppSelector` from `store/hooks.ts` (typed wrappers).
- **`theoriesSlice`** uses `createEntityAdapter` with **dual language stores**: `entitiesDe` and `entitiesEn` (normalized, sorted by popularity).
  - Example: `const currentDe = theoriesAdapter.getSelectors().selectAll(state.entitiesDe)` to retrieve all German theories.
  - `addTheory`, `updateTheory`, `deleteTheory` all take `{ lang, theory }` payload.
- **`syncStaticData()`** replaces static theories while preserving `isUserCreated` records—call in `Layout.tsx` on mount.
- **Undo/redo**: `redux-undo` wraps only `simulation` reducer (limit: 50 frames, excludes `resetParams` action). Do not build custom history.

### RTK Query & AI Caching
- Endpoints use `fakeBaseQuery` + `queryFn` wrapper around `geminiService` functions.
- Cache tags: `Analysis` (by theory ID + language), `Image`, `Satire`. Invalidate using `invalidatesTags`.
- Use `keepUnusedDataFor: 600` (10 min) for analysis to balance freshness vs. re-compute cost.

### Defensive Output Parsing
- `geminiService` includes `cleanJsonOutput()` (strips markdown, finds braces, removes control chars) and `flattenToString()` (converts nested objects to readable markdown).
- Always wrap AI responses in try-catch; model output is variable-quality and may not parse on first attempt.

## Component & UI Conventions

### Adding a New Page
1. **Route**: add lazy import + route in `App.tsx` (e.g., `React.lazy(() => import('./components/MyPage').then(m => ({ default: m.MyPage })))`).
2. **Navigation**: add `NavItem` entry in `components/Layout.tsx` (with icon, path, i18n key).
3. **Translations**: add EN/DE strings in `utils/translations.ts` (follow existing cyber-terminal tone: "UPLINK_OK", "CACHE_MODE").
4. **Base components**: use shared primitives from `components/ui/Common.tsx` (`PageHeader`, `PageFrame`, `Button`, `Card`, `Badge`, `Skeleton`) before creating new ones.

### Performance Patterns
- Memoize background visuals: `const BackgroundGrid = React.memo(() => (...))`—prevents re-renders on Redux state changes.
- Component lazy loading in route definitions; Vite auto-chunks large components.
- Use `useMemo` for expensive selectors or filtered data (e.g., building context brief in `DebunkChat.tsx`).
- Canvas animations: check `isVisible` via `IntersectionObserver` to pause off-screen (see `ReactiveCore` in `DebunkChat.tsx`).

### Accessibility & Streams
- Chat log pattern: `<div role="log" aria-live="polite">` for real-time updates (`DebunkChat.tsx`).
- Focus: global `:focus-visible` ring defined in `index.html`; `.touch-target-min` for mobile.
- Reduced-motion: respect `prefers-reduced-motion` CSS (defined in theme).

## Middleware & Side Effects

### Redux Listeners (appListeners.ts)
Use `startAppListening` to react to actions without thunks:
```typescript
startAppListening({
  actionCreator: toggleFavorite,
  effect: async (action, listenerApi) => {
    const theoryId = action.payload;
    const isFav = listenerApi.getState().theories.favorites.includes(theoryId);
    listenerApi.dispatch(addLog({ 
      message: `Archive: ${isFav ? 'Added to' : 'Removed from'} favorites`, 
      type: 'info' 
    }));
  }
});
```
- Use for audit trails, validation reactions, and cross-slice coordination.
- Error logger middleware in `store/middleware/errorLogger.ts` catches RTK Query errors.

## Data Flow Example: Theory Analysis
1. **Component** calls `useAnalyzeTheoryQuery({ theory, language, model, temp, budget })` from `aiApi.ts`.
2. **RTK Query** wraps call in `queryFn` → calls `analyzeTheoryWithGemini()` from `geminiService.ts`.
3. **Service** checks `dbService.getAnalysis(theory.id)` for cache, calls Gemini with safety settings, defensively parses JSON.
4. **Result** stored in RTK cache (keyed by `${theory.id}_${language}`), component accesses via `data` or `isLoading`.

## Build, Test & CI/CD

### Dev Commands
- `npm ci` + `npm run dev`: Installs dependencies, starts Vite on port 3000 (host 0.0.0.0).
- `npm run lint` (ESLint, max 300 warnings), `npm run typecheck` (non-blocking check).
- `npm run test:ci`: vitest in single-run mode; `npm run test:coverage` includes coverage report.
- `npm run build` → `npm run preview`: Build output to `dist/`, preview locally.

### Vite Configuration Specifics
- Dynamic `base` from `process.cwd()` for GitHub Pages (e.g., `/DisinfoDesk/`).
- Manual chunk splitting in `rollupOptions.output.manualChunks`:
  - `vendor-react`: React, Redux, React Router
  - `vendor-ai`: `@google/genai`
  - `vendor-charts`: Recharts, D3 deps
  - `vendor-icons`: Lucide
  - `vendor-pdf`: jsPDF, html2canvas
- Target: `esnext`, minify: `esbuild`, no sourcemap in prod.

### CI/CD Pipeline (.github/workflows/ci-cd.yml)
- **Lint** (fail-fast) → **Typecheck** (warn only) → **Tests** → **Build** → **Lighthouse** → **Deploy** (main only).
- TypeScript excludes `vitest.config.ts` and `vitest.setup.ts` via `tsconfig.json` (don't change).
- Deploy job runs `predeploy` script: `npm run lint && npm run typecheck && npm run build`.

### Testing Setup
- Jest-style globals via `vitest.setup.ts`: `describe`, `it`, `expect`, `beforeEach`, etc.
- Environment: jsdom; test pattern: `**/*.{test,spec}.{ts,tsx}`.
- Coverage excludes config files, types, and `node_modules/`.

## Service Worker & PWA Strategy

### sw.js Caching Strategies
- **Images**: Cache-First (120 max entries, 60-day TTL).
- **Fonts** (Google Fonts): Cache-First (1-year TTL, immutable).
- **JS/CSS/CDN**: Stale-While-Revalidate (background updates).
- **Dynamic API calls**: Network-First with fallback to cache.
- Update caching: increment `CACHE_SUFFIX` in `sw.js` to force cache purge on deploy.

### Service Worker Registration & Updates
- Registered in `Layout.tsx`; detects `registration.waiting` (new version ready).
- Update banner shows; user clicks → sends `postMessage({ type: 'SKIP_WAITING' })` to SW → SW calls `self.skipWaiting()`.
- Next navigation triggers controlled reload to new version.

## Data Storage & Security

### IndexedDB via dbService.ts
- Stores analyses, media analyses, chats, satires, app state, and binary blobs (images).
- **Compression**: JSON → Gzip (CompressionStream API).
- **Encryption**: AES-GCM (Web Crypto) with master key stored in a separate IndexedDB for key isolation.
- `redux-persist` adapter: `dbService.reduxStorage` serializes to compressed + encrypted blobs in `app_state` store.

### Secure API Key Management
- `secureApiKeyService.getApiKey()` reads from IndexedDB (never localStorage).
- Components should never access `@google/genai` directly; call `geminiService` functions.

## File Organization & Key Modules
- **`store/store.ts`**: Redux store config, persist whitelist, middleware setup.
- **`store/hooks.ts`**: Typed `useAppDispatch`, `useAppSelector`.
- **`services/geminiService.ts`**: All Gemini AI logic; defensive parsing, session management, grounding.
- **`services/dbService.ts`**: IndexedDB schema, crypto guards, compression.
- **`components/Layout.tsx`**: App shell, nav, online state, SW registration.
- **`components/ui/Common.tsx`**: Reusable UI primitives (PageHeader, Button, Card, etc.).
- **`utils/translations.ts`**: EN/DE strings for all UI labels and log messages.
- **`constants.ts`**: Static theory/media/author data sets.
