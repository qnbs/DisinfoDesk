# DisinfoDesk (Project Disinfo)

![Version](https://img.shields.io/badge/version-2.6.0--extended-blue.svg) 
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Tech](https://img.shields.io/badge/stack-React%2019%20%7C%20Redux%20Toolkit%20%7C%20Gemini%202.5-purple)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

> **Ein interaktives, KI-gestütztes Betriebssystem zur Analyse, Dekonstruktion und Simulation moderner Mythen, Verschwörungstheorien und urbaner Legenden.**

---

## 🌐 Überblick / Overview

**DisinfoDesk** ist mehr als ein Lexikon. Es ist eine Progressive Web App (PWA), die als pädagogisches Werkzeug dient, um Desinformation zu verstehen. Durch die Nutzung der Google Gemini API (Modelle `gemini-2.5-flash`, `gemini-3-pro`) bietet die App Echtzeit-Faktenchecks, simuliert virale Verbreitungswege und analysiert die Gefahrenpotenziale von Narrativen.

Die Anwendung ist vollständig **bilingual (Deutsch / Englisch)** und läuft dank **Offline-First Architektur** auch ohne permanente Internetverbindung (lokaler Cache).

---

## 🚀 Module & Features

### 1. 📊 The Dashboard (Command Center)
*   **Real-time Analytics:** Visualisierung von Datenpunkten mittels Recharts (Radar, Scatter, Area Charts).
*   **System Integrity:** Überwachung der "Systemlast" und Netzwerkaktivität (simuliert).
*   **Trend Detection:** Identifizierung viraler Narrative basierend auf Popularitäts-Scores.

### 2. 🗃️ The Archive (Datenbank)
*   **Procedural Art Engine:** Generiert dynamische SVG-Illustrationen für jede Theorie basierend auf Kategorie und ID.
*   **Deep Filtering:** Redux-gesteuerte Filterung nach Gefahrenstufe, Tags, Kategorie und Volltext.
*   **Entity Normalization:** Datenhaltung über `createEntityAdapter` für O(1) Zugriffszeiten.

### 3. 🧠 AI Intelligence Layer
*   **Dr. Veritas (Debunk Chat):** Ein skeptischer KI-Agent mit Streaming-Response, Sprachausgabe (TTS) und Spracherkennung (STT).
*   **Generation HUD:** Ein visueller "Heads-Up Display", der den Denkprozess der KI (Tokenisierung, Safety Checks, Rendering) transparent macht.
*   **Image Synthesis:** On-the-fly Generierung von atmosphärischen Bildern mittels `gemini-2.5-flash-image`.

### 4. ☣️ Threat Matrix (Gefahrenanalyse)
*   **Risk Assessment:** Klassifizierung von Theorien nach Radikalisierungspotenzial, Gesundheitsgefahr und demokratischer Erosion.
*   **Visual Data:** 3D-Scatterplots zur Korrelation von Viralität und Schweregrad.

### 5. 🕸️ Viral Simulation (Agent-Based Modeling)
*   **Canvas-basierte Simulation:** Visuelle Darstellung eines Infektionsnetzwerks (Nodes) in Echtzeit.
*   **Parameter-Steuerung:** Manipulation von R-Wert-Faktoren wie "Emotional Payload", "Echo Chamber Density" und "Visual Proof".
*   **Time-Travel:** Redux-basiertes Undo/Redo-System für Simulationsschritte.

### 6. 💾 The Vault (Database Manager)
*   **IndexedDB Wrapper:** Eigene `dbService`-Klasse für persistente Speicherung von Chats, Analysen und Satire-Texten.
*   **JSON Editor:** Eingebauter Code-Editor zur manuellen Manipulation von Datensätzen.
*   **Import/Export:** Vollständige Backup-Funktionalität des lokalen App-Status.

### 7. 🎬 Media Culture
*   **Pop Culture Analysis:** Analyse von Filmen, Spielen und Büchern auf okkulte Symbolik und "Predictive Programming".
*   **Relation Mapping:** Verknüpfung fiktiver Werke mit realen Verschwörungstheorien.

---

## 🛠️ Technische Architektur

### Frontend Core
*   **React 19:** Nutzung der neuesten Features (Suspense, Concurrent Mode).
*   **TypeScript:** Strenge Typisierung für alle Datenmodelle und API-Responses.
*   **Vite:** HMR und optimiertes Building.

### State Management (Redux Toolkit)
*   **Slices:** Modularer State für `settings`, `theories` und `simulation`.
*   **RTK Query:** Caching und Request-Management für die Google Gemini API (`fakeBaseQuery` Implementierung für SDK-Nutzung).
*   **Reselect:** Memoized Selectors für hochperformante Listenfilterung.
*   **Redux Persist:** Speicherung von User-Einstellungen und Favoriten im LocalStorage.

### Data Persistence
*   **IndexedDB:** Asynchrone Speicherung großer Datenmengen (komplette Analyse-Berichte, Chat-Logs) um den Main-Thread nicht zu blockieren.
*   **Service Worker:** Workbox-Integration für Caching von Assets, Fonts und App-Shell (PWA Level 5).

### UI/UX Design
*   **Tailwind CSS:** Utility-first Styling mit Custom Config für das "Cyber-Mystic" Theme.
*   **Framer Motion / CSS Animations:** Hardware-beschleunigte Übergänge.
*   **Canvas API:** Für Hochleistungs-Visualisierungen (Header-Wellen, Viral-Simulation).

---

## 📦 Installation & Setup

### Voraussetzungen
*   Node.js (v18+)
*   Google AI Studio API Key

### Schritte

1.  **Repository klonen**
    ```bash
    git clone https://github.com/your-username/disinfodesk.git
    cd disinfodesk
    ```

2.  **Abhängigkeiten installieren**
    ```bash
    npm install
    ```

3.  **Environment Variablen**
    Erstelle eine `.env` Datei im Root-Verzeichnis:
    ```env
    API_KEY=dein_google_gemini_api_key
    ```

4.  **Starten**
    ```bash
    npm start
    ```

---

## 📖 Nutzung des "Vault" (Datenbank)

Der **Vault** ist das Herzstück der lokalen Datenhaltung.

*   **Zugriff:** Über das Menü "The Vault" oder "Database".
*   **Funktion:** Hier werden alle KI-Analysen, Chat-Verläufe mit Dr. Veritas und generierte Satiren gespeichert.
*   **Security:** Die Daten verlassen nie Ihren Browser (Client-Side Only).
*   **Boot Sequence:** Beim ersten Laden wird eine Terminal-Boot-Sequenz simuliert, um die Initialisierung der IndexedDB zu visualisieren.

---

## ⚠️ Haftungsausschluss

Diese Anwendung dient ausschließlich **Bildungs- und Unterhaltungszwecken**.
*   Die KI-Analysen werden live generiert und können "Halluzinationen" (Fehlinformationen) enthalten.
*   Der "Satire-Generator" erstellt fiktive Inhalte.
*   Bitte nutzen Sie die bereitgestellten "Faktencheck"-Quellen für kritische Recherchen.

---

Made with 💻 and ☕ by a Senior Frontend Engineer.