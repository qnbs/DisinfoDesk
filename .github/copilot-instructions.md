# Copilot Instructions for DisinfoDesk

## Project Snapshot
- React 19 + TypeScript + Vite SPA in repository root (no `src/` folder).
- Routing uses `createHashRouter` in `App.tsx` for GitHub Pages compatibility (`/#/...`).
- Shell flow: `index.tsx` Redux provider → `App.tsx` context providers → `components/Layout.tsx` (nav, SW lifecycle, global UX).
- State is Redux Toolkit-first; key slices in `store/slices/*`, API layer in `store/api/aiApi.ts`.

## Hard Boundaries (keep these)
- External AI calls go through `services/geminiService.ts` only; components should not call `@google/genai` directly.
- Persistence goes through `services/dbService.ts` (`dbService.reduxStorage` for `redux-persist`).
- Gemini key is runtime-only via `services/secureApiKeyService.ts` + Settings UI; do not add build-time key injection.

## State & Data Patterns
- Always use typed hooks from `store/hooks.ts`: `useAppDispatch`, `useAppSelector`.
- Theories are normalized with `createEntityAdapter` and dual-language stores (`entitiesDe`/`entitiesEn`) in `store/slices/theoriesSlice.ts`.
- `syncStaticData()` merges refreshed static constants with user-created entries; `Layout` dispatches it on startup.
- Undo/redo is provided by `redux-undo` wrapping `simulation` in `store/store.ts`; do not implement custom history stacks.
- If you persist new slice fields, update whitelist/version in `store/store.ts` persist configs.

## Routing / i18n / UI Conventions
- New page checklist (must do all):
  1) lazy import + route in `App.tsx`
  2) nav wiring in `components/Layout.tsx`
  3) EN/DE labels in `utils/translations.ts`
- Reuse shared UI primitives from `components/ui/Common.tsx` (`PageFrame`, `PageHeader`, `Card`, `Button`, etc.).
- Keep the existing cyber/terminal tone in UI text and logs.

## PWA & Offline Integration
- Service worker behavior is in `sw.js` (Workbox strategies + `CACHE_SUFFIX` versioning).
- Update UX is controlled in `components/Layout.tsx` via `SKIP_WAITING` messaging.
- Preserve GitHub Pages compatibility: Vite `base` is derived from repo name in `vite.config.ts`, and hash routing + `404.html` fallback are required.

## AI/RTK Query Integration
- `store/api/aiApi.ts` uses `createApi` + `fakeBaseQuery` + endpoint `queryFn` wrappers to call `geminiService`.
- Maintain cache tags pattern (`ANALYSIS`/`IMAGE`/`SATIRE`) when extending endpoints.
- `geminiService` intentionally uses defensive parsing (`cleanJsonOutput`, `flattenToString`) for model variability—preserve this behavior.

## Dev Workflow (actual scripts)
- Install/run: `npm ci`, `npm run dev` (port 3000).
- Quality gates: `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build`.
- CI workflow is `.github/workflows/ci-cd.yml` (lint → test → build → Lighthouse → deploy on `main`).
- Lighthouse budgets enforced via `budget.json` + `lighthouserc.json` in CI.

## TypeScript & Code Quality
- `tsconfig.json` includes `noFallthroughCasesInSwitch` and `forceConsistentCasingInFileNames`.
- `vitest.config.ts` is excluded from main tsconfig to avoid Vite version mismatch errors.
- Use `type` imports for SDK types that may not be re-exported (e.g. `import type { LiveSession }` from genai).
- Barrel exports live in `constants.ts` and `types.ts`; sub-types are split across `types/models.ts`, `types/api.ts`, `types/state.ts`, `types/ui.ts`.

## Accessibility (WCAG 2.2 AA)
- Global `focus-visible` outline (2px cyan, 2px offset) is set in `index.html`.
- Touch targets must be ≥48×48px (`.touch-target-min` utility); mobile header buttons enforce `min-w-[48px] min-h-[48px]`.
- `prefers-reduced-motion` kills all animations globally; `prefers-contrast: more` lightens muted text.
- Chat message stream uses `role="log"` + `aria-live="polite"`.
- Skip-to-content link targets `#main-content`; sidebar has `role="navigation"`.
