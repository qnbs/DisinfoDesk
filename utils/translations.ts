
export const translations = {
  de: {
    common: {
      systemLoad: 'Systemlast',
      online: 'Online',
      offline: 'Offline Modus',
      connecting: 'Verbinde...',
      loading: 'Laden...',
      back: 'Zurück',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      export: 'Exportieren',
      import: 'Importieren',
      search: 'Suchen',
      filter: 'Filter',
      clear: 'Leeren',
      close: 'Schließen',
      confirm: 'Bestätigen',
      copy: 'Kopieren',
      copied: 'Kopiert',
      reset: 'Zurücksetzen',
      unknown: 'Unbekannt',
      version: 'Version',
      build: 'Build',
      ready: 'Bereit',
      unsaved: 'Ungespeichert',
      visual: 'Visuell',
      code: 'Quellcode'
    },
    layout: {
      footer: {
        stable: 'Uplink Stabil',
        offline: 'Offline Modus',
        ping: 'PING',
        cache: 'NUR CACHE',
        reboot: 'System Neustart',
        id: 'ID',
        integrity: 'Systemintegrität'
      },
      mobile: {
        uplink: 'MOBIL UPLINK',
        command: 'System Kommando'
      },
      sidebar: {
        primary: 'Primäre Module',
        core: 'System Kern',
        install: 'APP INSTALLIEREN',
        local: 'Lokales Protokoll',
        online: 'System Online'
      },
      sub: {
        overview: 'ÜBERSICHT',
        database: 'DATENBANK',
        culture: 'KULTUR',
        profiles: 'PROFILE',
        threats: 'BEDROHUNGEN',
        analytics: 'ANALYTIK',
        uplink: 'KI UPLINK',
        simulation: 'SIMULATION',
        creator: 'EDITOR',
        storage: 'SPEICHER',
        config: 'KONFIG',
        manual: 'HANDBUCH'
      }
    },
    nav: {
      dashboard: 'Dashboard',
      archive: 'Das Archiv',
      dangerous: 'Bedrohungen',
      virality: 'Viralität',
      chat: 'Debunk-Bot',
      generator: 'Generator',
      settings: 'Einstellungen',
      help: 'Hilfe',
      media: 'Medien & Kultur',
      database: 'Der Tresor',
      authors: 'Autoren-Bibliothek',
      editor: 'Theorie-Labor'
    },
    authors: {
        title: 'Autoren-Bibliothek',
        subtitle: 'Architekten des Unbekannten',
        filter: 'Fokus',
        all: 'Alle Profile',
        searchPlaceholder: 'Suche Autor, Buch oder Thema...',
        bio: 'Biografie',
        works: 'Schlüsselwerke',
        influence: 'Einfluss-Index',
        focus: 'Kerngebiete',
        indexed: 'PROFILE INDEXIERT',
        notFound: 'KEINE PROFILE GEFUNDEN',
        notFoundDesc: 'Die angeforderten Agenten wurden geschwärzt oder existieren in diesem Sektor nicht.',
        semantic: 'Semantischer Index',
        cats: {
            all: 'Alle Profile',
            cosmic: 'Kosmos & Ursprung',
            system: 'System & Kontrolle',
            history: 'Geschichte & Finanzen',
            esoteric: 'Esoterik & Krypto'
        }
    },
    dashboard: {
      title: 'Lagebericht',
      subtitle: 'Aktueller Status der Desinformation und Mythenbildung.',
      total: 'Erfasste Theorien',
      critical: 'Gefährliche Narrative',
      virality: 'Durchschnittliche Verbreitung',
      integrity: 'Datenintegrität',
      sources: 'KI-Analyse Aktiv',
      distribution: 'Verteilung nach Kategorien',
      toplist: 'Viralitäts-Topliste (Top 3)',
      temporal: 'Temporale Bedrohungsmatrix',
      map: 'Globale Inzidenz-Karte',
      ticker: {
        detected: 'DETEKTIERT: Hochfrequenzsignal im Sektor 7G...',
        warning: 'WARNUNG: Desinformations-Spitze bzgl. "Projekt Blue Beam"...',
        analysis: 'ANALYSE: 98,4% Wahrscheinlichkeit für Bot-Aktivität...',
        system: 'SYSTEM: Gemini 2.5 Node betriebsbereit...',
        archive: 'ARCHIV: Neue Beweise zur "Roswell"-Akte hinzugefügt...'
      }
    },
    dangerPage: {
        title: 'PROTOKOLL OMEGA',
        subtitle: 'Analyse von Narrativen, die ein unmittelbares Risiko für die gesellschaftliche Stabilität, die öffentliche Gesundheit oder die demokratische Integrität darstellen.',
        status: 'KRITISCHER ALARM',
        defcon: 'DEFCON',
        readiness: {
            max: 'MAXIMALE BEREITSCHAFT',
            elevated: 'ERHÖHTE ALARMSTUFE',
            normal: 'NORMALE BEREITSCHAFT'
        },
        stats: {
            active: 'Aktive Bedrohungen',
            avg: 'Ø Viralität'
        },
        cards: {
          radicalization: { title: 'Radikalisierungsrisiko', desc: 'Narrative, die Gläubige isolieren und Gewalt gegen "Feinde" legitimieren.' },
          health: { title: 'Gesundheitsgefahr', desc: 'Falschinformationen, die zur Ablehnung medizinischer Hilfe oder Einnahme schädlicher Substanzen führen.' },
          erosion: { title: 'Gesellschaftliche Erosion', desc: 'Systematische Untergrabung des Vertrauens in Institutionen, Wissenschaft und objektive Realität.' }
        },
        listHeader: 'Identifizierte Hochrisiko-Ziele',
        priority: 'Prioritäts-Ziele',
        impact: 'IMPACT SCORE',
        vector: 'Vektor-Analyse'
    },
    viralPage: {
        title: 'VIRALE MECHANIK',
        subtitle: 'Simulations-Engine',
        timelineTitle: 'Narrative Entstehung (Timeline)',
        mediaTitle: 'Die Evolution der Übertragungswege',
        sim: {
          core: 'Simulation Core',
          infected: 'Infiziert',
          velocity: 'Geschwindigkeit',
          params: {
            emotional: 'Emotionale Ladung',
            novelty: 'Neuheitswert (Schock)',
            visual: 'Visuelle "Beweise"',
            echo: 'Echokammer-Dichte'
          },
          scenarios: {
            echo: 'Echokammer',
            bot: 'Bot Angriff',
            organic: 'Organisch',
            lockdown: 'Containment'
          },
          actions: {
            factCheck: 'Faktencheck',
            ban: 'Cluster Bann'
          },
          hud: {
              title: 'VEKTOR_SIM_V4',
              density: 'DICHTE_KARTE_AKTIV',
              live: 'LIVE_KNOTEN_PROPAGATION'
          }
        },
        timeline: {
          static: { title: 'Die Statische Ära', desc: 'Verbreitung über Flugblätter und Bücher. Hohe Hürden, langsame Übertragung.' },
          broadcast: { title: 'Die Broadcast Ära', desc: 'Radio und TV erlaubten zentrale Verbreitung. Verschwörungen wurden zu nationalen Events.' },
          forum: { title: 'Die Foren Ära', desc: 'Frühes Internet (Usenet). Dezentrale Gemeinschaften bilden isolierte Realitäten.' },
          algo: { title: 'Die Algorithmische Ära', desc: 'Algorithmen priorisieren Engagement über Wahrheit. Bot-Netzwerke als Waffen.' }
        }
    },
    mediaPage: {
      title: 'Fiktionen der Wahrheit',
      subtitle: 'Popkultur Archiv',
      status: 'DECODIERE...',
      noSignal: 'Kein Signal',
      access: 'Akte öffnen',
      filter: {
        all: 'Alle Medien',
        movie: 'Filme',
        book: 'Literatur',
        series: 'TV-Serien',
        game: 'Spiele',
        comic: 'Comics'
      },
      labels: {
        realityScore: 'Realitäts-Index',
        complexity: 'Komplexität',
        creator: 'Schöpfer',
        year: 'Jahr',
        narrative: 'Das Narrativ',
        symbolism: 'Okkulte Symbolik',
        predictive: 'Predictive Programming',
        parallels: 'Reale Parallelen',
        related: 'Verwandte Akten'
      },
      complexity: {
        LOW: 'Linear',
        MEDIUM: 'Vielschichtig',
        HIGH: 'Komplex',
        MINDBENDING: 'Mindbending'
      }
    },
    list: {
      title: 'Das Archiv',
      subtitle: 'Durchsuchen Sie die Datenbank nach Schlüsselwörtern, Namen und Themen.',
      searchPlaceholder: 'Suche (z.B. NASA, Echsen)...',
      allCategories: 'Alle Kategorien',
      threatMatrix: 'Bedrohungs-Matrix',
      keywords: 'Metadaten Keywords',
      filterTags: 'Filtern nach Tags:',
      allTags: 'Alle Tags',
      noResults: 'Keine Ergebnisse gefunden.',
      noResultsSub: 'Vielleicht wurde diese Theorie von den Mächtigen bereits gelöscht?',
      view: {
        grid: 'Raster',
        list: 'Liste',
        compact: 'Kompakt'
      },
      sort: {
        viralHigh: 'Viralität (Hoch)',
        viralLow: 'Viralität (Niedrig)',
        newest: 'Neueste (Ursprung)',
        oldest: 'Älteste (Ursprung)',
        az: 'A-Z'
      }
    },
    editor: {
        titleNew: 'NEUE THEORIE',
        titleEdit: 'AKTE BEARBEITEN',
        subtitle: 'THEORIE LABOR // EDITOR',
        labels: {
            title: 'Titel / Betreff',
            desc: 'Kurzbeschreibung (Zusammenfassung)',
            category: 'Kategorie',
            threat: 'Gefahrenstufe',
            origin: 'Ursprungsjahr',
            tags: 'Meta-Tags',
            cover: 'Cover Visualisierung',
            virality: 'Viralitäts-Index'
        },
        placeholders: {
            title: 'z.B. Der Mond ist aus Käse',
            desc: 'Beschreibe die Theorie in 1-2 Sätzen...',
            tags: 'Tag hinzufügen...',
            image: 'Bild-URL einfügen...'
        },
        info: 'Vom Benutzer erstellte Theorien werden lokal in Ihrem Browser-Cache gespeichert (Redux Persist). Sie bleiben über Neustarts hinweg erhalten, werden aber nicht auf einen Server hochgeladen. Nutzen Sie "Export" in den Einstellungen für Backups.'
    },
    detail: {
      back: 'Zurück',
      analyzing: 'Analysiere Geheimdaten...',
      accessing: 'Zugriff auf Gemini 2.5 Node',
      generateImage: 'Visualisierung generieren',
      generating: 'Generiere Bild...',
      theory: 'Die Theorie',
      origin: 'Ursprung',
      danger: 'Gefahrenstufe',
      popularity: 'Verbreitung',
      popSub: 'Basierend auf Suchanfragen & Trends',
      debunk: 'Fakten-Check',
      consensus: 'Wissenschaftlicher Konsens',
      refutation: 'Widerlegung',
      seeAlso: 'Siehe auch: Verwandte Akten',
      sources: 'Weiterführende Recherche',
      network: 'Netzwerk',
      timeline: 'Zeitstrahl',
      connections: 'Verbindungen',
      error: 'Fehler beim Laden der Daten.',
      refresh: 'Analyse aktualisieren',
      edit: 'Akte bearbeiten',
      readTime: 'Lesezeit',
      min: 'Min',
      topology: 'Narrative Topologie',
      nodesDetected: 'Knoten erkannt',
      timelineEvents: {
          inception: { title: 'Die Gründung', desc: 'Das Narrativ taucht erstmals im öffentlichen Diskurs auf, oft in Randpublikationen.' },
          threshold: { title: 'Virale Schwelle', desc: 'Die Theorie überspringt die Nische zur Subkultur, angetrieben durch Foren.' },
          mainstream: { title: 'Mainstream Kontakt', desc: 'Erwähnung in Massenmedien oder Filmen zementiert den Platz im Zeitgeist.' },
          current: { title: 'Aktueller Status', desc: 'Laufender Viralitäts-Index. Das Narrativ entwickelt sich weiter.' }
      }
    },
    chat: {
      botName: 'Dr. Veritas',
      botStatus: 'Skeptiker-KI • Online',
      welcome: 'Hallo. Ich bin Dr. Veritas. Hast du eine Theorie gehört, die dir seltsam vorkommt? Lass uns gemeinsam die Fakten prüfen.',
      placeholder: 'Frage etwas, z.B. "Stimmt es, dass Vögel Drohnen sind?"',
      reset: 'Reset Uplink',
      save: 'Sitzung archivieren',
      voice: 'Sprachausgabe',
      verdict: {
        true: 'VERIFIZIERTE WAHRHEIT',
        false: 'WIDERLEGT',
        misleading: 'IRREFÜHREND',
        unverified: 'UNBESTÄTIGT'
      },
      error: 'Verbindung zum Skeptiker-Netzwerk unterbrochen.'
    },
    satire: {
      title: 'Der Aluhut-Generator',
      subtitle: 'Manchmal ist die Realität zu langweilig. Lassen Sie die KI eine absolut harmlose, aber verrückte Verschwörungstheorie erfinden.',
      instruction: 'Klicke auf den Button, um die "Wahrheit" zu erfahren.',
      loading1: 'Verbinde Punkte...',
      loading2: 'Interpretiere Kornkreise...',
      copy: 'Text kopieren',
      copied: 'In Zwischenablage kopiert',
      buttonNew: 'Neue Theorie generieren',
      buttonStart: 'Enthülle die Wahrheit',
      archived: 'Archiviert',
      saveVault: 'In Vault speichern',
      format: 'Format',
      tone: 'Tonfall',
      formats: {
          leak: 'Geleaktes Memo',
          forum: 'Foren-Rant',
          article: 'Zeitungsartikel'
      },
      tones: {
          angry: 'Wütend',
          scientific: 'Pseudo-Wissenschaftlich',
          mystical: 'Mystisch'
      },
      params: {
        subject: 'Zielobjekt',
        paranoia: 'Realitätsverzerrung',
        archetype: 'Erzähl-Archetyp'
      },
      subjects: {
        CATS: 'Katzen',
        INTERNET: 'Das Internet',
        FOOD: 'Fast Food',
        CLOUDS: 'Wolken',
        OFFICE: 'Büromaterial',
        SOCKS: 'Socken',
        MATH: 'Mathematik',
        TIME: 'Zeitzonen'
      },
      archetypes: {
        ANCIENT: { label: 'Antike Mystik', desc: 'Runen, Flüche und vergessene Götter.' },
        CYBER: { label: 'Cyber Dystopie', desc: 'KI, Glitches und Überwachung.' },
        GOV: { label: 'Bürokratie', desc: 'Formulare, Akten und geheime Komitees.' },
        BIO: { label: 'Bio-Horror', desc: 'Mutationen, Schleim und DNA.' }
      }
    },
    vault: {
      title: 'Tresor Manager',
      subtitle: 'Sicherer Speicherzugriff',
      directory: 'Verzeichnis',
      usedSpace: 'Belegter Speicher',
      totalFiles: 'Dateien Gesamt',
      purge: 'Batch Löschung',
      empty: 'Ordner Leer',
      emptyDesc: 'Keine Aufzeichnungen in diesem Sektor gefunden.',
      searchPlaceholder: 'Suche ID / Titel...',
      visual: 'Visuell',
      source: 'Quellcode',
      modify: 'Modifizieren',
      commit: 'Bestätigen',
      awaiting: 'WARTE AUF EINGABE',
      awaitingDesc: 'Wählen Sie einen Datensatz aus dem Index.',
      tabs: {
        analyses: 'Analysen',
        media: 'Medien',
        chats: 'Chats',
        satires: 'Satire'
      }
    },
    settings: {
      title: 'Systemkonfiguration',
      tabs: {
        GENERAL: 'Allgemein',
        INTELLIGENCE: 'Intelligenz',
        INTERFACE: 'Interface',
        PRIVACY: 'Datenschutz',
        SYSTEM: 'Systeminfo'
      },
      sections: {
        localization: { title: 'Lokalisierungsprotokoll', desc: 'Wählen Sie die Primärsprache für Interface und KI-Synthese.' },
        neural: { title: 'Neurale Konfiguration', desc: 'Feinabstimmung der Gemini 2.5 Generative Engine.' },
        visual: { title: 'Visuell & Haptisch', desc: 'Anpassung von Viewport und Feedback.' },
        privacy: { title: 'Datensouveränität', desc: 'Verwalten Sie Ihren lokalen Fußabdruck.' },
        system: { title: 'Systemdiagnose', desc: 'Versionskontrolle und Umgebungsstatus.' }
      },
      labels: {
        modelSelect: 'Modellauswahl',
        temp: 'Temperatur (Kreativität)',
        contrast: 'Hoher Kontrast',
        motion: 'Reduzierte Bewegung',
        sound: 'Interface-Töne',
        typography: 'Typografie-Skalierung',
        incognito: 'Inkognito-Modus',
        export: 'Daten exportieren',
        purge: 'System Reset',
        contrastDesc: 'Erhöht die Sichtbarkeit von Rändern und reduziert Transparenz.',
        motionDesc: 'Deaktiviert komplexe Animationen und Übergänge.',
        soundDesc: 'Spielt subtile Töne bei Interaktionen.',
        incognitoDesc: 'Verhindert das Protokollieren von Anfragen im Verlauf (simuliert).'
      },
      models: {
          flash: { title: 'Gemini 2.5 Flash', desc: 'Ausgewogene Leistung. Ideal für allgemeine Aufgaben.' },
          pro: { title: 'Gemini 3.0 Pro (Vorschau)', desc: 'Erweiterte Logikfähigkeiten.' }
      },
      privacyNote: 'DisinfoDesk arbeitet mit einer Client-Side-Architektur. Ihr Suchverlauf wird in der IndexedDB (Vault) Ihres Browsers gespeichert und nicht an unsere Server gesendet, außer für notwendige API-Aufrufe an Google Gemini.'
    },
    help: {
      title: 'Handbuch für Wahrheitssuchende',
      howItWorks: 'Wie funktioniert das?',
      howItWorksText: 'Wählen Sie eine Theorie aus dem Archiv, um eine Echtzeit-Analyse durchzuführen. Unser KI-Agent prüft Fakten, historischen Ursprung und wissenschaftlichen Konsens.',
      dangerLevels: 'Gefahrenstufen erklärt',
      disclaimer: 'Haftungsausschluss',
      disclaimerText: 'Die generierten Inhalte dienen Bildungs- und Unterhaltungszwecken. KI kann halluzinieren. Prüfen Sie wichtige Informationen immer anhand von Primärquellen.'
    },
    search: {
      placeholder: 'Suche Datenbank, Befehle oder Entitäten...',
      noResults: 'KEINE TREFFER IM ARCHIV',
      footerLeft: 'DISINFODESK OS v2.7',
      footerRight: 'INDEXIERUNG ABGESCHLOSSEN'
    },
    onboarding: {
      step0: { title: 'SPRACHPROTOKOLL', msg: 'Bitte wählen Sie Ihre bevorzugte Interface-Sprache für die Initialisierung.' },
      step1: { title: 'AGENTEN ORIENTIERUNG', msg: 'Identität bestätigt. Willkommen beim DisinfoDesk, Ihrer Kommandozentrale zur Analyse moderner Informationskriege.' },
      step2: { title: 'MODUL NAVIGATION', msg: 'Greifen Sie über die Seitenleiste auf das Archiv, die Bedrohungsmatrix und virale Simulatoren zu.' },
      step3: { title: 'GLOBALE AUFKLÄRUNG', msg: 'Nutzen Sie OmniSearch (CMD+K), um sofort die gesamte Datenbank nach Theorien, Autoren und Medien zu durchsuchen.' },
      step4: { title: 'KI UPLINK', msg: 'Dr. Veritas steht bereit. Nutzen Sie das Chat-Modul für Echtzeit-Faktenchecks und Logikanalysen.' },
      skip: 'BRIEFING ÜBERSPRINGEN',
      next: 'WEITER',
      init: 'INITIALISIEREN'
    }
  },
  en: {
    common: {
      systemLoad: 'System Load',
      online: 'Online',
      offline: 'Offline Mode',
      connecting: 'Connecting...',
      loading: 'Loading...',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export',
      import: 'Import',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      close: 'Close',
      confirm: 'Confirm',
      copy: 'Copy',
      copied: 'Copied',
      reset: 'Reset',
      unknown: 'Unknown',
      version: 'Version',
      build: 'Build',
      ready: 'Ready',
      unsaved: 'Unsaved',
      visual: 'Visual',
      code: 'Source Code'
    },
    layout: {
      footer: {
        stable: 'Uplink Stable',
        offline: 'Offline Mode',
        ping: 'PING',
        cache: 'CACHE_ONLY',
        reboot: 'System Reboot',
        id: 'ID',
        integrity: 'System Integrity'
      },
      mobile: {
        uplink: 'MOBILE UPLINK',
        command: 'System Command'
      },
      sidebar: {
        primary: 'Primary Modules',
        core: 'System Core',
        install: 'INSTALL APP',
        local: 'Local Protocol',
        online: 'System Online'
      },
      sub: {
        overview: 'OVERVIEW',
        database: 'DATABASE',
        culture: 'CULTURE',
        profiles: 'PROFILES',
        threats: 'THREATS',
        analytics: 'ANALYTICS',
        uplink: 'AI UPLINK',
        simulation: 'SIMULATION',
        creator: 'CREATOR',
        storage: 'STORAGE',
        config: 'CONFIG',
        manual: 'MANUAL'
      }
    },
    nav: {
      dashboard: 'Dashboard',
      archive: 'The Archive',
      dangerous: 'Threats',
      virality: 'Virality',
      chat: 'Debunk-Bot',
      generator: 'Generator',
      settings: 'Settings',
      help: 'Help',
      media: 'Media & Culture',
      database: 'The Vault',
      authors: 'Author Library',
      editor: 'Theory Lab'
    },
    authors: {
        title: 'Author Library',
        subtitle: 'Architects of the Unknown',
        filter: 'Focus',
        all: 'All Authors',
        searchPlaceholder: 'Search author, book, or topic...',
        bio: 'Biography',
        works: 'Key Works',
        influence: 'Influence Index',
        focus: 'Focus Areas',
        indexed: 'PROFILES INDEXED',
        notFound: 'NO PROFILES FOUND',
        notFoundDesc: 'The requested agents have been redacted or do not exist in this sector.',
        semantic: 'Semantic Index',
        cats: {
            all: 'All Profiles',
            cosmic: 'Cosmic & Origins',
            system: 'System & Control',
            history: 'History & Finance',
            esoteric: 'Esoteric & Crypto'
        }
    },
    dashboard: {
      title: 'Situation Report',
      subtitle: 'Current status of disinformation and myth formation.',
      total: 'Recorded Theories',
      critical: 'Dangerous Narratives',
      virality: 'Average Spread',
      integrity: 'Integrity',
      sources: 'AI Analysis Active',
      distribution: 'Distribution by Category',
      toplist: 'Virality Top List (Top 3)',
      temporal: 'Temporal Threat Matrix',
      map: 'Global Incidence Map',
      ticker: {
        detected: 'DETECTED: High frequency signal in sector 7G...',
        warning: 'WARNING: Disinformation spike regarding "Project Blue Beam"...',
        analysis: 'ANALYSIS: 98.4% probability of bot activity in trending tags...',
        system: 'SYSTEM: Gemini 2.5 Node operational...',
        archive: 'ARCHIVE: New evidence added to "Roswell" case file...'
      }
    },
    dangerPage: {
        title: 'PROTOCOL OMEGA',
        subtitle: 'Analysis of narratives that pose immediate risks to societal stability, public health, or democratic integrity. Handle with extreme caution.',
        status: 'CRITICAL ALERT',
        defcon: 'DEFCON',
        readiness: {
            max: 'MAXIMUM READINESS',
            elevated: 'ELEVATED ALERT',
            normal: 'NORMAL READINESS'
        },
        stats: {
            active: 'Active Threats',
            avg: 'Avg. Virality'
        },
        cards: {
          radicalization: { title: 'Radicalization Risk', desc: 'Narratives that isolate believers and legitimize violence against perceived "enemies".' },
          health: { title: 'Health Hazard', desc: 'Misinformation leading to refusal of medical treatment or consumption of harmful substances.' },
          erosion: { title: 'Societal Erosion', desc: 'Systematic undermining of trust in institutions, science, and the concept of objective reality itself.' }
        },
        listHeader: 'Identified High-Priority Targets',
        priority: 'Priority Targets',
        impact: 'IMPACT SCORE',
        vector: 'Vector Analysis'
    },
    viralPage: {
        title: 'VIRAL MECHANICS',
        subtitle: 'Analytics Engine',
        timelineTitle: 'Narrative Genesis Timeline',
        mediaTitle: 'The Evolution of Transmission Vectors',
        sim: {
          core: 'Simulation Core',
          infected: 'Infected',
          velocity: 'Velocity',
          params: {
            emotional: 'Emotional Payload',
            novelty: 'Novelty / Shock',
            visual: 'Visual "Evidence"',
            echo: 'Echo Chamber Density'
          },
          scenarios: {
            echo: 'Echo Chamber',
            bot: 'Bot Attack',
            organic: 'Organic Spread',
            lockdown: 'Total Containment'
          },
          actions: {
            factCheck: 'Fact Check',
            ban: 'Ban Cluster'
          },
          hud: {
              title: 'VECTOR_SIM_V4',
              density: 'DENSITY_MAP_ENABLED',
              live: 'LIVE_NODE_PROPAGATION'
          }
        },
        timeline: {
          static: { title: 'The Static Era', desc: 'Spread via pamphlets and books. High barrier to entry, slow transmission, high persistence.' },
          broadcast: { title: 'The Broadcast Era', desc: 'Radio and TV allowed centralized dissemination. Conspiracies became synchronized national events.' },
          forum: { title: 'The Forum Era', desc: 'Early internet (Usenet, Forums). Decentralized communities begin to form "alternate realities" in isolation.' },
          algo: { title: 'The Algorithmic Era', desc: 'Social media algorithms prioritize engagement over truth. Micro-targeting and bot networks weaponize narratives.' }
        }
    },
    mediaPage: {
      title: 'Fictions of Truth',
      subtitle: 'Pop Culture Archive',
      status: 'DECODING...',
      noSignal: 'No Signal',
      access: 'Access File',
      filter: {
        all: 'All Media',
        movie: 'Movies',
        book: 'Literature',
        series: 'TV Series',
        game: 'Games',
        comic: 'Comics'
      },
      labels: {
        realityScore: 'Reality Index',
        complexity: 'Complexity',
        creator: 'Creator',
        year: 'Year',
        narrative: 'The Narrative',
        symbolism: 'Occult Symbolism',
        predictive: 'Predictive Programming',
        parallels: 'Real World Parallels',
        related: 'Related Archives'
      },
      complexity: {
        LOW: 'Linear',
        MEDIUM: 'Layered',
        HIGH: 'Complex',
        MINDBENDING: 'Mindbending'
      }
    },
    list: {
      title: 'The Archive',
      subtitle: 'Search the database for keywords, names, and topics.',
      searchPlaceholder: 'Search (e.g. NASA, Lizards)...',
      allCategories: 'All Categories',
      threatMatrix: 'Threat Matrix',
      keywords: 'Metadata Keywords',
      filterTags: 'Filter by Tags:',
      allTags: 'All Tags',
      noResults: 'No results found.',
      noResultsSub: 'Maybe this theory was already deleted by the powers that be?',
      view: {
        grid: 'Grid View',
        list: 'List View',
        compact: 'Table View'
      },
      sort: {
        viralHigh: 'Viral (High)',
        viralLow: 'Viral (Low)',
        newest: 'Newest',
        oldest: 'Oldest',
        az: 'A-Z'
      }
    },
    detail: {
      back: 'Back',
      analyzing: 'Analyzing secret data...',
      accessing: 'Accessing Gemini 2.5 Node',
      generateImage: 'Generate Visualization',
      generating: 'Generating Image...',
      theory: 'The Theory',
      origin: 'Origin',
      danger: 'Danger Level',
      popularity: 'Spread',
      popSub: 'Based on search queries & trends',
      debunk: 'Fact Check',
      consensus: 'Scientific Consensus',
      refutation: 'Refutation',
      seeAlso: 'See also: Related Files',
      sources: 'Further Research',
      network: 'Connections',
      timeline: 'Timeline',
      connections: 'Connections',
      error: 'Error loading data.',
      refresh: 'Refresh Analysis',
      edit: 'Edit File',
      readTime: 'Reading Time',
      min: 'Min',
      topology: 'Narrative Topology',
      nodesDetected: 'Nodes Detected',
      timelineEvents: {
          inception: { title: 'The Inception', desc: 'The narrative first appears in public discourse, often in fringe publications or isolated communities.' },
          threshold: { title: 'Viral Threshold', desc: 'The theory bridges the gap from niche to subculture, gaining traction via forums or alternative media.' },
          mainstream: { title: 'Mainstream Exposure', desc: 'Mentioned in major media, films, or political discourse, cementing its place in the cultural zeitgeist.' },
          current: { title: 'Current Status', desc: 'Current virality index. The narrative continues to evolve.' }
      }
    },
    chat: {
      botName: 'Dr. Veritas',
      botStatus: 'Skeptical AI • Online',
      welcome: 'Hello. I am Dr. Veritas. Have you heard a theory that seems odd? Let\'s check the facts together.',
      placeholder: 'Ask something, e.g. "Are birds actually drones?"',
      reset: 'Reset Uplink',
      save: 'Archive Session',
      voice: 'Voice Output',
      verdict: {
        true: 'VERIFIED TRUTH',
        false: 'DEBUNKED',
        misleading: 'MISLEADING',
        unverified: 'UNVERIFIED'
      },
      error: 'Connection to Skeptic Network interrupted.'
    },
    satire: {
      title: 'Tinfoil Hat Generator',
      subtitle: 'Sometimes reality is too boring. Let AI invent an absolutely harmless but crazy conspiracy theory.',
      instruction: 'Click the button to learn the "Truth".',
      loading1: 'Connecting dots...',
      loading2: 'Interpretiere crop circles...',
      copy: 'Copy Text',
      copied: 'Copied to clipboard',
      buttonNew: 'Generate New Theory',
      buttonStart: 'Reveal the Truth',
      archived: 'Archived',
      saveVault: 'Save to Vault',
      format: 'Format',
      tone: 'Tone',
      formats: {
          leak: 'Leaked Memo',
          forum: 'Forum Rant',
          article: 'News Article'
      },
      tones: {
          angry: 'Angry',
          scientific: 'Pseudo-Scientific',
          mystical: 'Mystical'
      },
      params: {
        subject: 'Target Subject',
        paranoia: 'Reality Distortion',
        archetype: 'Narrative Archetype'
      },
      subjects: {
        CATS: 'Cats',
        INTERNET: 'The Internet',
        FOOD: 'Fast Food',
        CLOUDS: 'Clouds',
        OFFICE: 'Office Supplies',
        SOCKS: 'Missing Socks',
        MATH: 'Mathematics',
        TIME: 'Time Zones'
      },
      archetypes: {
        ANCIENT: { label: 'Ancient Mysticism', desc: 'Runes, curses, and forgotten gods.' },
        CYBER: { label: 'Cyber Dystopia', desc: 'AI, simulation glitches, and surveillance.' },
        GOV: { label: 'Bureaucracy', desc: 'Red tape, paperwork, and secret committees.' },
        BIO: { label: 'Biological Horror', desc: 'Mutations, slime, and DNA manipulation.' }
      }
    },
    vault: {
      title: 'Vault Manager',
      subtitle: 'Secure Storage Access',
      directory: 'Directory',
      usedSpace: 'Used Space',
      totalFiles: 'Total Files',
      purge: 'Batch Purge',
      empty: 'Folder Empty',
      emptyDesc: 'No records found in this sector.',
      searchPlaceholder: 'Search ID / Title...',
      visual: 'Visual',
      source: 'Source',
      modify: 'Modify',
      commit: 'Commit',
      awaiting: 'AWAITING INPUT',
      awaitingDesc: 'Select a record from the vault index to inspect content.',
      tabs: {
        analyses: 'Analyses',
        media: 'Media',
        chats: 'Chats',
        satires: 'Satire'
      }
    },
    settings: {
      title: 'System Configuration',
      tabs: {
        GENERAL: 'General',
        INTELLIGENCE: 'Intelligence',
        INTERFACE: 'Interface',
        PRIVACY: 'Data & Privacy',
        SYSTEM: 'System Info'
      },
      sections: {
        localization: { title: 'Localization Protocol', desc: 'Select the primary language for interface and AI synthesis.' },
        neural: { title: 'Neural Configuration', desc: 'Fine-tune the behavior of the Gemini 2.5 generative engine.' },
        visual: { title: 'Visual & Haptic', desc: 'Customize the viewport and sensory feedback.' },
        privacy: { title: 'Data Sovereignty', desc: 'Manage your local footprint.' },
        system: { title: 'System Diagnostic', desc: 'Version control and environment status.' }
      },
      labels: {
        modelSelect: 'Model Selection',
        temp: 'Temperatur (Creativity)',
        contrast: 'High Contrast Mode',
        motion: 'Reduced Motion',
        sound: 'Interface Sounds',
        typography: 'Typography Scaling',
        incognito: 'Incognito Mode',
        export: 'Export Data JSON',
        purge: 'System Reset',
        contrastDesc: 'Increases border visibility and reduces transparency.',
        motionDesc: 'Disables complex animations and transitions.',
        soundDesc: 'Play subtle cues on interaction.',
        incognitoDesc: 'Prevents logging of queries to local history (simulated).'
      },
      models: {
          flash: { title: 'Gemini 2.5 Flash', desc: 'Balanced performance. Ideal for general tasks.' },
          pro: { title: 'Gemini 3.0 Pro (Preview)', desc: 'Enhanced reasoning capabilities.' }
      },
      privacyNote: 'DisinfoDesk operates on a client-side architecture. Your search history is stored in your browser\'s IndexedDB (Vault) and is not sent to our servers, except for necessary API calls to Google Gemini.'
    },
    help: {
      title: 'Guide for Truth Seekers',
      howItWorks: 'How does it work?',
      howItWorksText: 'Select a theory from the archive to perform a real-time analysis. Our AI agent checks facts, historical origins, and scientific consensus.',
      dangerLevels: 'Danger Levels Explained',
      disclaimer: 'Disclaimer',
      disclaimerText: 'Generated content is for educational and entertainment purposes. AI can hallucinate. Always verify important information with primary sources.'
    },
    search: {
      placeholder: 'Search database, commands, or entities...',
      noResults: 'NO MATCHES IN ARCHIVE',
      footerLeft: 'DISINFODESK OS v2.7',
      footerRight: 'INDEXING COMPLETE'
    },
    onboarding: {
      step0: { title: 'LANGUAGE PROTOCOL', msg: 'Please select your primary interface language for initialization.' },
      step1: { title: 'AGENT ORIENTATION', msg: 'Identity Confirmed. Welcome to DisinfoDesk, your central command for analyzing and deconstructing modern information warfare.' },
      step2: { title: 'MODULE NAVIGATION', msg: 'Access the Archive, Threat Matrix, and Viral Simulators from the secure sidebar. Your toolkit lies here.' },
      step3: { title: 'GLOBAL INTEL', msg: 'Use OmniSearch (CMD+K) to instantly query the entire database of theories, authors, and media artifacts.' },
      step4: { title: 'AI UPLINK', msg: 'Dr. Veritas is standing by. Use the Chat module for real-time fact-checking and logic analysis.' },
      skip: 'SKIP BRIEFING',
      next: 'NEXT',
      init: 'INITIALIZE'
    }
  }
};
