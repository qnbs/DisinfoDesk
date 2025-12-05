
<div align="center">

```text
██████╗ ██╗███████╗██╗███╗   ██╗███████╗ ██████╗ ██████╗ ███████╗███████╗██╗  ██╗
██╔══██╗██║██╔════╝██║████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██║ ██╔╝
██║  ██║██║███████╗██║██╔██╗ ██║█████╗  ██║   ██║██║  ██║█████╗  ███████╗█████╔╝ 
██║  ██║██║╚════██║██║██║╚██╗██║██╔══╝  ██║   ██║██║  ██║██╔══╝  ╚════██║██╔═██╗ 
██████╔╝██║███████║██║██║ ╚████║██║     ╚██████╔╝██████╔╝███████╗███████║██║  ██╗
╚═════╝ ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
```

**SYSTEM DESIGNATION: DISINFODESK // CODENAME: PROJECT OMEGA**

[![Release](https://img.shields.io/badge/release-v2.7.0--modular-06b6d4?style=for-the-badge&logo=git)](https://github.com/your-repo/disinfodesk)
[![Core](https://img.shields.io/badge/core-React_19_%7C_TypeScript_5-3178C6?style=for-the-badge&logo=react)](https://react.dev/)
[![State](https://img.shields.io/badge/state-Redux_Toolkit_%2B_Undo-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Intelligence](https://img.shields.io/badge/neural-Gemini_2.5_Pro-8E75B2?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/license-MIT-ef4444?style=for-the-badge)](LICENSE)

*An advanced Cognitive Defense Grid and OSINT Analysis Platform engineered to deconstruct modern disinformation vectors through generative AI and agent-based simulation.*

[<kbd>LAUNCH SYSTEM</kbd>](#-installation--deployment) • [<kbd>ARCHITECTURE</kbd>](#%EF%B8%8F-technical-architecture) • [<kbd>INTELLIGENCE LAYER</kbd>](#-neural-intelligence-layer)

</div>

---

## 🌐 Executive Summary

**DisinfoDesk** is a sovereign, Progressive Web Application (PWA) designed as an educational counter-measure against narrative warfare. Unlike static encyclopedias, it functions as a live operating system.

By leveraging **Google's Gemini 2.5 Flash & Pro models**, the system performs real-time forensic analysis of conspiracy theories, hallucinates satirical narratives for educational contrast, and mathematically models viral spread using **Canvas-based agent simulations**.

The architecture follows a strict **Local-First / Offline-Capable** philosophy, utilizing a custom IndexedDB wrapper (`Vault`) to ensure user data sovereignty.

---

## 🏛️ Technical Architecture

The system is built upon a high-performance, type-safe stack designed for reliability and complex state orchestration.

### Core Stack
*   **Runtime:** React 19 (leveraging Concurrent Mode & Suspense boundaries).
*   **Language:** TypeScript 5 (Strict Mode enabled).
*   **Build System:** Vite (HMR & Module Federation ready).
*   **Styling:** Tailwind CSS with a custom "Cyber-Mystic" configuration & CSS Variables for high-performance theming.

### State Management & Persistence (The "Cortex")
The application utilizes a sophisticated Redux Toolkit implementation:
*   **Entity Normalization:** Usage of `createEntityAdapter` for O(1) lookups of Theories and Authors, optimizing rendering performance for large datasets.
*   **Time-Travel Debugging:** The `simulation` slice is wrapped in `redux-undo`, allowing users to traverse the history of viral parameters (Undo/Redo).
*   **Hydration:** `redux-persist` is configured with a custom storage engine (`dbService`) to sync Redux state directly to IndexedDB.

### The Vault (Storage Layer)
Instead of relying on `localStorage` (blocking, low quota), DisinfoDesk implements a custom Singleton `DatabaseService` class.
*   **Technology:** Native `IndexedDB` API.
*   **Capabilities:** Asynchronous CRUD operations for heavy text payloads (Chat Logs, AI Analyses) and Blobs.
*   **Encryption:** Ready for client-side encryption (Architecture prepared).

---

## 🧠 Neural Intelligence Layer

The AI integration is not merely a chatbot; it is deeply woven into the application's fabric via the `@google/genai` SDK.

### 1. Dr. Veritas (Skeptical Engine)
*   **Model:** `gemini-2.5-flash` (Low latency) or `gemini-3-pro` (Deep reasoning).
*   **System Prompting:** Hardened system instructions force the model into a "Scientific Skeptic" persona, utilizing structured headers like `[VERDICT: ...]`.
*   **Architecture:** Implemented via RTK Query `fakeBaseQuery` to manage loading states, caching, and error handling within the Redux lifecycle.

### 2. Search Grounding (OSINT)
*   The analysis module utilizes the `googleSearch` tool integration to fetch real-time, cited refutations for conspiracy theories, ensuring the AI does not hallucinate historical facts.

### 3. Procedural Art & Vision
*   **Generative:** Uses `gemini-2.5-flash-image` to synthesize atmospheric, "X-Files" style evidence photos.
*   **Algorithmic Fallback:** A custom `artEngine.ts` generates deterministic SVG vector art based on theory IDs and entropy seeds when offline or to save tokens.

---

## 🕸️ Vector Simulation Engine

A dedicated module for visualizing the mathematics of virality.

*   **Rendering:** HTML5 Canvas (2D Context) optimized with `requestAnimationFrame` and off-screen buffering concepts.
*   **Logic:** Agent-Based Modeling (ABM) with ~120 autonomous nodes.
*   **Parameters:**
    *   *Echo Chamber Density:* Controls spatial segregation of nodes.
    *   *Emotional Payload:* Modifies infection probability.
    *   *Visual Proof:* Modifies node velocity/transmission speed.

---

## 📂 System Topology

```text
/src
├── components/        # React UI Components (Atomic Design)
│   ├── ui/            # Generic primitives (Card, Button, HUD)
│   └── ...            # Feature-specific modules (Chat, Editor)
├── config/            # System constants & Theme definitions
├── contexts/          # React Contexts (Toast, Language, Settings)
├── data/              # Static seed data (Theories, Media, Authors)
├── services/          # External IO (Gemini SDK, IndexedDB wrapper)
├── store/             # Redux Logic
│   ├── api/           # RTK Query definitions
│   ├── middleware/    # Custom middleware (Error Logging, Analytics)
│   └── slices/        # Feature reducers
├── types/             # TypeScript Definitions (Strict contracts)
└── utils/             # Heuristics & Helpers
```

---

## 🚀 Installation & Deployment

### Prerequisites
*   Node.js v18+
*   A valid [Google AI Studio API Key](https://aistudio.google.com/) (Required for Neural Modules)

### Initialization Sequence

1.  **Clone Repository**
    ```bash
    git clone https://github.com/your-username/disinfodesk.git
    cd disinfodesk
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory.
    ```env
    # Critical for AI functions. Get one at aistudio.google.com
    API_KEY=AIzaSy...
    ```

4.  **Dev Mode Launch**
    ```bash
    npm start
    ```
    *Access the uplink at `http://localhost:5173`*

### Production Build
```bash
npm run build
# The 'dist' folder is now ready for deployment (Vercel, Netlify, Docker).
```

---

## 🛡️ Usage Protocols

### The Archive
The central database. Use the **OmniSearch (CMD+K)** to instantly query normalized data across Theories, Authors, and Media.

### The Editor (Theory Lab)
Create new theory files. The system uses a specialized prompt to "draft" content based on a title, and the **Art Engine** automatically generates a unique cover image. These files are persisted locally.

### Threat Matrix (Protocol Omega)
A visual dashboard classifying narratives by "Danger Level." It utilizes Recharts for 3D Scatterplots correlating `Virality` vs. `Severity`.

---

## ⚠️ Liability Disclaimer

**DisinfoDesk is a simulation and educational tool.**
*   **AI hallucinations:** The "Dr. Veritas" module may generate plausible but incorrect information. Always verify citations.
*   **Satire:** The "Satire Generator" creates fictional narratives for illustrative purposes.
*   **Privacy:** This system operates **Client-Side**. Your query history is stored in your browser's IndexedDB and is not transmitted to our servers (only strictly necessary prompts are sent to Google's API).

---

<div align="center">

**[ END OF TRANSMISSION ]**

<sub>Engineered by a Senior Frontend Engineer</sub>

</div>