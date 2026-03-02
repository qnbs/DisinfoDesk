# Copilot Instructions for DisinfoDesk

## Core Mission

Transform DisinfoDesk into the world's most comprehensive, engaging, and authoritative interactive compendium of modern myths, conspiracy theories, and urban legends. Additionally enhance the entire app with all necessary supporting features while maintaining 100% local-first, offline-capable, and client-side-only architecture.

### Key Principles (Never Violate)
- **Content Excellence:** Every entry must be richly detailed, neutral yet educational, with fact-check notes, source links, and educational context.
- **Expansion Priority:** Authors & Media are critical – expand data, cross-references, and influence metrics.
- **Educational & Ethical:** Add learning objectives, "Why it spreads" explanations, and active-learning prompts. Prominent disclaimers on every screen.
- **Multilingual Excellence:** Full EN/DE bilingual support via Language Context with precise translations.
- **Technical Excellence:** Extend entity adapters, maintain Redux normalized state, enhance OmniSearch, add new filters and visualizations. Never break PWA offline mode or local Vault.

---

## Big Picture Architecture

- **React 19 + TypeScript SPA** built with Vite and `createHashRouter` (see `App.tsx`).
- **App shell & providers:** Redux `<Provider>` → `SettingsProvider` → `LanguageProvider` → `ToastProvider` in `App.tsx`.
- **Feature pages:** Route-level lazy modules in `App.tsx`; layout/navigation/service-worker lifecycle centralized in `components/Layout.tsx`.
- **State:** Redux Toolkit-first (`store/store.ts`), RTK Query for AI calls (`store/api/aiApi.ts`), listener middleware for cross-slice reactions (`store/middleware/appListeners.ts`).

---

## Data Flow & Service Boundaries

- **UI logic** in components/slices; **external IO** in `services/`.
- `services/geminiService.ts`: **Only boundary for Gemini SDK calls** (analysis, media analysis, satire, drafting, image generation).
- `services/dbService.ts`: **Persistence boundary** – IndexedDB + compression + AES-GCM + BroadcastChannel sync + redux-persist storage adapter.
- Redux persistence uses `dbService.reduxStorage` (not `localStorage`) in `store/store.ts`.

---

## Core Project Patterns (Follow These)

- Always use typed hooks from `store/hooks.ts` (`useAppDispatch`, `useAppSelector`).
- Keep theory entities normalized with `createEntityAdapter` in `store/slices/theoriesSlice.ts`.
- Language-specific content is dual-stored (`entitiesDe` / `entitiesEn`) and selected via `settings.language` selectors.
- Simulation history uses `redux-undo` wrapping `simulation` in `store/store.ts`; do not manually add custom undo stacks.
- UI transient state is in `uiSlice`; context-switch behavior (e.g., chat reset on context change) is intentional in `injectChatContext`.
- Use `react-router-dom` hooks (`useNavigate`, `useParams`, `useLocation`).

---

## Routing, UI, & i18n Conventions

- When adding a page: wire **all** of:
  1. Lazy import + route in `App.tsx`
  2. Nav entry in `components/Layout.tsx`
  3. Labels in `utils/translations.ts` (EN / DE)
- Reuse shared primitives from `components/ui/Common.tsx` (`PageFrame`, `PageHeader`, `Card`, `Button`, `Badge`) instead of creating parallel base components.
- Keep the existing "system terminal / cyber" UX language and naming tone consistent across all UI text.

---

## AI Integration Details

- **Env setup:** Set `GEMINI_API_KEY`; Vite maps to `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (`vite.config.ts`).
- Prefer existing service functions (`analyzeTheoryWithGemini`, `generateSatireTheory`, `generateTheoryImage`, etc.) instead of direct SDK usage in components.
- `aiApi` uses `fakeBaseQuery`; endpoint-level `queryFn` handles errors and cache tagging. Follow this pattern for new AI endpoints.
- Analysis parsing is intentionally defensive (`cleanJsonOutput`, `flattenToString`) due to model output variability.

---

## Offline/PWA & Persistence Nuances

- Service worker (`sw.js`) uses Workbox with explicit cache buckets and `CACHE_SUFFIX`; bump suffix when cache strategy changes.
- Layout handles SW update UX (`SKIP_WAITING` message flow). Keep update handling in `Layout` unless redesigning app shell behavior.
- Vault export/import/storage tooling is surfaced in `components/DatabaseManager.tsx`; preserve compatibility with `dbService` schema (`DB_VERSION`, store names).

---

## App Auditing & Quality Assurance

### Lighthouse Audits
- Target scores: Performance ≥85, Accessibility ≥90, Best Practices ≥90, SEO ≥90, PWA ≥80.
- Run audits regularly against production URL (`/DisinfoDesk/`).
- Use `lighthouserc.json` budgets to enforce thresholds in CI/CD.

### Accessibility (WCAG 2.1 AA)
- **Touch Targets:** Minimum 44×44px for all interactive elements.
- **Color Contrast:** Text must meet 4.5:1 ratio (AA) or 7:1 (AAA).
- **Focus Indicators:** Use `focus-visible` with visible 2px offset rings.
- **Skip Navigation:** Include skip-to-main-content link for keyboard users.
- **ARIA:** Add labels, roles, and live regions for dynamic content.
- **Reduced Motion:** Respect `prefers-reduced-motion` media query; disable animations for users who opt in.

### Performance Optimization
- Monitor Core Web Vitals (LCP, FID, CLS).
- Optimize image assets (AVIF, WebP with fallbacks).
- Code-split routes and defer non-critical imports.
- Use Service Worker caching strategically (CacheFirst, StaleWhileRevalidate, NetworkFirst).

### Testing & Validation
- ESLint + TypeScript for code quality.
- Vitest for unit tests (minimal coverage baseline: 60%).
- Manual regression testing on key user flows (Theory → Author → Media navigation).
- PWA installability checks (manifest, icons, theme colors).

### Code Review Checklist
- No build-time API key injection.
- Redux patterns followed (normalized state, entity adapters).
- Bilingual content & translations complete (EN/DE).
- Offline-first feature compatibility verified.
- UI accessibility compliance (contrast, touch targets, ARIA).

---

## Developer Workflow

- Use `npm run dev` for local dev (Vite server on port 3000 in `vite.config.ts`).
- Build with `npm run build`, preview with `npm run preview`.
- Validate with:
  ```bash
  npm run lint          # ESLint
  npm run typecheck     # TypeScript
  npm run test          # Vitest (watch mode)
  npm run test:ci       # Vitest (single run)
  npm run build         # Production build
  ```
- Run Lighthouse audits: `npm run lighthouse` (if configured).

---

## Change Scope Guidance

- For Authors/Media expansion: prefer substantial but structured incremental changes over minimal edits; still avoid introducing alternative state/routing/storage abstractions.
- Preserve barrel exports in `constants.ts` and `types.ts` to avoid breaking import surfaces.
- If adding new persisted state: explicitly update persist whitelist/version strategy in `store/store.ts`.
- **App Auditing:** Conduct accessibility, performance, and security audits regularly. Document findings in README or GitHub issues.

---

## Conflict Resolution

- Conflict between instructions? **Content quality & educational value always wins.**
- Use incremental delivery: ship in coherent slices (data model → content → UI integration) and keep each slice buildable.
- Prioritize security and user privacy over convenience.

---

## File Structure & Naming

```
src/
├── App.tsx                          # Main app shell & routing
├── index.tsx                        # Entry point
├── index.html                       # HTML template with Tailwind config
├── components/
│   ├── Layout.tsx                   # Nav, SW lifecycle, app frame
│   ├── ui/
│   │   ├── Common.tsx               # Shared components (Button, Card, Skeleton, etc.)
│   │   ├── GenerationHUD.tsx        # AI generation progress overlay
│   │   └── Toast.tsx                # Toast notification system
│   ├── TheoryList.tsx               # Theory archive grid/list
│   ├── TheoryDetail.tsx             # Single theory detail view
│   ├── TheoryEditor.tsx             # Theory create/edit form
│   ├── AuthorLibrary.tsx            # Authors grid browser
│   ├── AuthorDetail.tsx             # Single author profile
│   ├── MediaCulture.tsx             # Media grid/analytics
│   ├── MediaDetail.tsx              # Single media detail
│   ├── DebunkChat.tsx               # Dr. Veritas chat interface
│   ├── SatireGenerator.tsx          # Satire remix tool
│   ├── DangerousNarratives.tsx      # Threat matrix heatmap
│   ├── Dashboard.tsx                # System overview
│   ├── OmniSearch.tsx               # Universal search (CMD+K)
│   ├── Settings.tsx                 # User config & preferences
│   ├── DatabaseManager.tsx          # Vault UI
│   ├── Help.tsx                     # Help & onboarding
│   └── OnboardingTour.tsx           # Interactive tutorial
├── data/
│   ├── authors.ts                   # Author profiles (EN/DE)
│   ├── media.ts                     # Media items (images/videos/articles)
│   ├── */ts                         # Category-specific theories
│   └── index.ts                     # Data aggregation & exports
├── store/
│   ├── store.ts                     # Redux store setup
│   ├── hooks.ts                     # Typed Redux hooks
│   ├── api/
│   │   └── aiApi.ts                 # RTK Query for Gemini API
│   ├── middleware/
│   │   ├── appListeners.ts          # Cross-slice reactions
│   │   └── errorLogger.ts           # Error handling middleware
│   └── slices/
│       ├── theoriesSlice.ts         # Theory entity adapter + selectors
│       ├── settingsSlice.ts         # User settings (lang, contrast, etc.)
│       ├── simulationSlice.ts       # Viral simulation state (with redux-undo)
│       ├── satireSlice.ts           # Satire generation state
│       └── uiSlice.ts               # Transient UI state (modals, loading, etc.)
├── services/
│   ├── geminiService.ts             # Gemini SDK facade
│   └── dbService.ts                 # IndexedDB persistence & encryption
├── contexts/
│   ├── LanguageContext.tsx          # Language/translation provider
│   ├── SettingsContext.tsx          # Settings UI context (experimental)
│   └── ToastContext.tsx             # Toast notification context
├── hooks/
│   └── useRouter.ts                 # Router utilities (deprecated; use react-router-dom)
├── types/
│   ├── models.ts                    # Theory, Author, Media types
│   ├── state.ts                     # Redux state shape
│   ├── api.ts                       # Gemini API types
│   └── ui.ts                        # UI component prop types
├── utils/
│   ├── translations.ts              # EN/DE translation dictionary
│   └── artEngine.ts                 # SVG/ASCII art generation
├── config/
│   ├── system.ts                    # System constants
│   └── theme.ts                     # Tailwind theme overrides
├── constants.ts                     # App-wide constants
├── types.ts                         # Re-exported types barrel
├── vite.config.ts                   # Vite build config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies & scripts
├── manifest.json                    # PWA manifest
├── sw.js                            # Service worker
└── 404.html                         # GitHub Pages SPA fallback
```

---

## Git Workflow

- Use conventional commits: `feat(feature)`, `fix(bug)`, `docs(readme)`, `refactor(code)`, `test(unit)`, `chore(deps)`.
- Example: `feat(authors): add 50 new author profiles with cross-references`.
- Keep PRs focused and buildable; avoid half-implemented features on main.

---

## Useful Resources

- Redux Toolkit: https://redux-toolkit.js.org/
- RTK Query: https://redux-toolkit.js.org/rtk-query/overview
- React Router: https://reactrouter.com/
- Workbox: https://developers.google.com/web/tools/workbox
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

---

## Summary

This is a comprehensive media literacy PWA focused on **content expansion, accessibility, and educational rigor**. Maintain local-first persistence, bilingual UX, and strict client-side architecture. Conduct regular app audits (Lighthouse, WCAG, security) and iteratively improve user experience. No substitutes for expert advice; always verify independently.
