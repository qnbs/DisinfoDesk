```text
░▒▓█ SYNTH-NET UPLINK :: CHANNEL 0xDD-84 █▓▒░
┌──────────────────────────────────────────────────────────────────────────────┐
│  ██████╗ ██╗███████╗██╗███╗   ██╗███████╗ ██████╗ ██████╗ ███████╗██╗  ██╗  │
│  ██╔══██╗██║██╔════╝██║████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝██║ ██╔╝  │
│  ██║  ██║██║███████╗██║██╔██╗ ██║█████╗  ██║   ██║██║  ██║█████╗  █████╔╝   │
│  ██║  ██║██║╚════██║██║██║╚██╗██║██╔══╝  ██║   ██║██║  ██║██╔══╝  ██╔═██╗   │
│  ██████╔╝██║███████║██║██║ ╚████║██║     ╚██████╔╝██████╔╝███████╗██║  ██╗  │
│  ╚═════╝ ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝  │
└──────────────────────────────────────────────────────────────────────────────┘
    >>> neon://truth-grid  |  D15INF0D35K  |  OFFLINE-FIRST // HASH-ROUTED <<<
░▒▓█ SIGNAL: STABLE • MODE: TERMINAL-HACK x SYNTHWAVE • STATUS: ONLINE █▓▒░
```

# DisinfoDesk

> ⚠️ **Reine Bildungszwecke / Educational only**  
> Dieses Projekt dient der Medienkompetenz und Analyse von Desinformation. Keine medizinische, rechtliche oder psychologische Beratung. Lokale Gesetze beachten und Inhalte unabhängig verifizieren.

Interaktive, lokale und offlinefähige Research-PWA für die Untersuchung von Mythen, Verschwörungserzählungen, Narrativen, Autoren und Medienbezügen. DisinfoDesk kombiniert kuratierte Datensätze mit optionaler KI-gestützter Einordnung – strikt client-side und local-first.

## Live Demo
- https://qnbs.github.io/DisinfoDesk/

## Inhaltsverzeichnis
- [Value Proposition](#value-proposition)
- [Key Capabilities](#key-capabilities)
- [Architecture Snapshot](#architecture-snapshot)
- [Tech Stack](#tech-stack)
- [Security & Privacy Model](#security--privacy-model)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Runtime Configuration](#runtime-configuration)
- [PWA & Offline Behavior](#pwa--offline-behavior)
- [Operational Runbook](#operational-runbook)
- [Troubleshooting](#troubleshooting)
- [Governance & Responsible Use](#governance--responsible-use)
- [Contributing](#contributing)
- [Lizenz](#lizenz)

## Value Proposition
- **Educational Simulation Tool:** Fokus auf Medienkompetenz, nicht auf Aktivismus, Therapie oder Beratung.
- **Local-First by Default:** Persistenz und Caching sind auf lokale Kontrolle und Offline-Nutzung ausgelegt.
- **Client-Side AI Integration:** Gemini-Funktionen sind optional und werden erst mit lokal hinterlegtem API-Key aktiv.
- **Research UX:** Hash-Routing, strukturierte Detailseiten, Such-/Filterflows und narrative Cross-Referenzen.

## Key Capabilities
- **Theory Archive:** Strukturierte Erfassung und Exploration narrativer Entitäten.
- **Authors Library:** Profile, Einflussdimensionen und verknüpfte Inhalte.
- **Media Analysis:** Kultur-/Medienobjekte mit Kontext und Zuordnungen.
- **Debunk Chat („Dr. Veritas“):** Skeptischer Dialogmodus mit optionalem Kontextpaket.
- **Satire Generator:** Didaktischer Kontrastmodus zur Erkennung manipulativer Muster.
- **Vault Operations:** Lokale Datenhaltung, Import/Export-Workflows und PWA-fähiger Betrieb.

## Architecture Snapshot
- **Frontend:** React 19 + TypeScript + Vite.
- **State Layer:** Redux Toolkit, RTK Query, `redux-persist`, `redux-undo`.
- **Routing:** `createHashRouter` (`/#/...`) für robuste GitHub-Pages-Kompatibilität.
- **Persistence:** IndexedDB-basierter Vault über `services/dbService.ts` (inkl. Compression/Encryption-Pipeline für Vault-Daten).
- **AI Boundary:** `services/geminiService.ts` als zentrale Integrationsschicht für Gemini-Aufrufe.
- **PWA Runtime:** Workbox-basiertes `sw.js` mit differenzierten Caching-Strategien.

## Tech Stack
- **Runtime:** React 19, React Router 6, Redux Toolkit, RTK Query.
- **Visualization:** Recharts.
- **AI SDK:** `@google/genai`.
- **Build Tooling:** Vite 6, TypeScript 5.
- **UI/Icons:** Tailwind/CSS Utility Styling + `lucide-react`.

## Security & Privacy Model

### Gemini API Key Handling
- Der Gemini API Key wird **nicht** über Build-Umgebungsvariablen in Bundles injiziert.
- Key-Setzung erfolgt zur Laufzeit in **Settings → Privacy**.
- Speicherung erfolgt lokal verschlüsselt in IndexedDB via `secureApiKeyService`.
- Bei fehlendem Key wird explizit ein Runtime-Fehler mit UI-Hinweis ausgelöst.

### Vault & Data-at-Rest
- Persistente App-Daten laufen über IndexedDB (`DisinfoDesk_Vault`).
- Vault-Pipeline verwendet Compression + AES-GCM-gestützte Ent-/Verschlüsselung.
- Multi-Tab-Synchronisation erfolgt via `BroadcastChannel`.

### Empfehlung für Key-Härtung
- API-Key in Google AI Studio auf `*.github.io` beschränken.
- Angemessene Quotas/Rate-Limits setzen.
- Bei Verdacht auf Leck sofort rotieren.

## Local Development
```bash
npm ci
npm run dev
```

Lokaler Dev-Server läuft standardmäßig auf Port `3000`.

## Production Build
```bash
npm run build
npm run preview
```

Build-Merkmale:
- Minifizierung via `esbuild`.
- Source Maps im Production-Build deaktiviert.
- Chunking/Asset-Hashing für Cache-Busting.
- Repo-basierter `base`-Pfad für GitHub Pages (`/DisinfoDesk/`).

## GitHub Pages Deployment

### CI Workflow
- Workflow: `.github/workflows/deploy.yml`
- Trigger: `push` auf `main` + manuell (`workflow_dispatch`)
- Actions: Checkout, Node LTS Setup, `npm ci`, `npm run build`, Artifact Upload, Pages Deploy

### Setup-Schritte
1. Repository auf `main` pushen.
2. In GitHub: **Settings → Pages → Source: GitHub Actions** aktivieren.
3. Workflow **Deploy to GitHub Pages** ausführen/abwarten.
4. Live unter: https://qnbs.github.io/DisinfoDesk/

### SPA-Fallback auf Pages
- `404.html` leitet auf Hash-Routes (`/DisinfoDesk/#/...`) um.
- Dadurch funktionieren direkte Deep-Links auch auf statischem Hosting.

## Runtime Configuration

### Environment Files
- `.env.example` dokumentiert den Runtime-Hinweis.
- Relevanter Punkt: Der Gemini-Key wird **in der App**, nicht beim Build, gesetzt.

### Gemini Key setzen
1. App öffnen.
2. Zu **Settings → Privacy** wechseln.
3. API Key speichern.
4. Statusanzeige „Stored encrypted“ verifizieren.

## PWA & Offline Behavior

### Manifest
- `start_url` und `scope` sind auf `/DisinfoDesk/` abgestimmt.
- App-Shortcuts zeigen auf hash-basierte Ziele.

### Service Worker (`sw.js`)
- Workbox `CacheFirst` für Images/Fonts.
- `StaleWhileRevalidate` für Scripts/Styles/CDN-Assets.
- `NetworkFirst` für Gemini-API-Aufrufe mit Timeout.
- Navigation-Fallback auf `index.html` innerhalb der registrierten Scope.

### Praktischer Offline-Test
1. Seite einmal online öffnen.
2. DevTools → Network → Offline.
3. Navigation in bereits gecachten Bereichen prüfen.

## Operational Runbook

### Standard Release Flow
1. Lokal `npm ci && npm run build`.
2. Auf `main` mergen.
3. Deploy-Workflow überwachen.
4. Nach Go-Live Hard-Refresh + SW-Update prüfen.

### Post-Deploy Checks
- Startseite lädt ohne 404.
- Assets kommen mit korrektem Base-Pfad.
- Hash-Routen (`#/archive`, `#/media`, `#/authors`) funktionieren.
- PWA Installability weiterhin gegeben.
- Gemini-Funktionalität mit lokal gesetztem Key testbar.

### Performance/Quality Baselines (Empfehlung)
- Lighthouse (Mobile/Desktop) gegen Production-URL laufen lassen.
- Fokus: Performance, Accessibility, Best Practices, PWA.
- Bei SW-Änderungen `CACHE_SUFFIX` erhöhen, um sauberes Invalidieren zu erzwingen.

## Troubleshooting

### Blank Page nach Deploy
- Prüfen, dass `base` in `vite.config.ts` auf Repo-Pfad zeigt.
- Browser-Cache + Service Worker aktualisieren.

### Assets laden nicht (404)
- Sicherstellen, dass GitHub Pages via Actions deployed.
- Build-Output in `dist/` und Workflow-Artefakt prüfen.

### SPA Routing bricht bei Reload
- `404.html` muss im Repository-Root vorhanden sein.
- Hash-Fallback auf `/DisinfoDesk/#/...` darf nicht entfernt werden.

### Gemini Features schlagen fehl
- API Key in Settings hinterlegt?
- Domain-Beschränkung in AI Studio korrekt (`*.github.io`)?
- Quota/Rate-Limit erreicht?

### PWA Update wird nicht übernommen
- UI-Update-Hinweis auslösen und „Reload“ bestätigen.
- Falls nötig: Hard-Reload und alten SW manuell entfernen.

## Governance & Responsible Use
- Kein Ersatz für medizinische, rechtliche, psychologische oder sicherheitsrelevante Beratung.
- Inhalte dienen der Aufklärung, Analyse und kritischen Reflexion.
- Nutzer tragen Verantwortung für Compliance mit lokalen Gesetzen und Plattformregeln.
- Quellen und Behauptungen stets unabhängig verifizieren.

## Contributing
Beiträge sind willkommen – bevorzugt in kleinen, nachvollziehbaren PRs:
- **Docs-first:** bei Verhaltensänderungen auch README/Guides aktualisieren.
- **Security-first:** keine Secrets, keine Build-Key-Injektion.
- **Offline-first:** PWA- und Subpath-Kompatibilität nicht regressieren.
- **State Consistency:** Redux-Normalisierung und Persistenz-Patterns beibehalten.

## Roadmap (kurz)
- Ausbau Author/Media-Datenbasis und Cross-Referenzen.
- Weitere didaktische Lernpfade und Fact-Check-Exports.
- Zusätzliche UX-Verbesserungen für Recherche-Workflows.

## Lizenz
MIT – siehe [LICENSE](LICENSE).
