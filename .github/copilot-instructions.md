# Copilot Instructions for DisinfoDesk

## Architecture at a glance
- Root-level React 19 + TypeScript + Vite SPA (no `src/`). Entry flow is `index.tsx` → `App.tsx` → `components/Layout.tsx`.
- Routing is hash-based via `createHashRouter` in `App.tsx` for GitHub Pages deep-link compatibility.
- `Layout.tsx` is the app shell: navigation, online/offline handling, service worker registration/update UX, and startup data sync.
- State is Redux Toolkit-first (`store/store.ts` + slices), with RTK Query for AI calls (`store/api/aiApi.ts`).

## Non-negotiable boundaries
- Do not call `@google/genai` from components/slices; all model access goes through `services/geminiService.ts`.
- Do not add build-time API key injection; Gemini key is runtime-only via `components/Settings.tsx` + `services/secureApiKeyService.ts`.
- Persist through `services/dbService.ts`; `redux-persist` storage adapter is `dbService.reduxStorage` in `store/store.ts`.
- Keep GitHub Pages compatibility intact: `vite.config.ts` dynamic `base`, hash routes, and `404.html` fallback.

## State, data, and caching patterns
- Always use typed Redux hooks from `store/hooks.ts` (`useAppDispatch`, `useAppSelector`).
- `theoriesSlice` uses `createEntityAdapter` with dual language entity stores (`entitiesDe` / `entitiesEn`).
- `syncStaticData()` in `store/slices/theoriesSlice.ts` preserves `isUserCreated` records while refreshing static constants.
- Undo/redo is provided by `redux-undo` wrapping `simulation` in `store/store.ts`; do not build a separate history stack.
- If new persisted fields are added, update persist config `whitelist`/`version` in `store/store.ts`.

## AI integration specifics
- RTK Query endpoints in `store/api/aiApi.ts` use `fakeBaseQuery` + `queryFn` wrappers around `geminiService` functions.
- Preserve cache tag taxonomy when extending AI endpoints: `Analysis`, `Image`, `Satire`.
- `geminiService` includes defensive parsing (`cleanJsonOutput`, `flattenToString`) for variable model output; keep this behavior.

## UI/i18n conventions
- New page checklist (all required):
  1) add lazy import + route in `App.tsx`
  2) add nav entry in `components/Layout.tsx`
  3) add EN/DE strings in `utils/translations.ts`
- Prefer shared primitives from `components/ui/Common.tsx` before creating new base components.
- Keep the established cyber-terminal tone in labels/log copy (see `utils/translations.ts`, `settingsSlice` logs).

## PWA, accessibility, and runtime details
- Service worker logic is in `sw.js` (Workbox strategies + `CACHE_SUFFIX` invalidation + `SKIP_WAITING` message flow).
- Update banner path is in `Layout.tsx` (`registration.waiting` → `postMessage({ type: 'SKIP_WAITING' })`).
- Accessibility baselines live in `index.html`: global `:focus-visible`, reduced-motion handling, high-contrast support, skip-link, and `.touch-target-min`.
- Chat stream accessibility pattern appears in `components/DebunkChat.tsx` (`role="log"`, `aria-live="polite"`).

## Developer workflow (actual project commands)
- Install/dev: `npm ci`, `npm run dev` (Vite on port `3000`, host `0.0.0.0`).
- Quality/build: `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build`, `npm run preview`.
- CI pipeline is `.github/workflows/ci-cd.yml`: lint → typecheck (non-blocking) → tests → build → Lighthouse → deploy (main only).
- TypeScript excludes `vitest.config.ts`/`vitest.setup.ts` in `tsconfig.json`; keep that separation unless the tooling setup changes.
