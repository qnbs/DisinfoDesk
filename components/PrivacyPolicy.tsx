import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Lock, Server, Eye, Database, AlertTriangle, Globe, Trash2, Mail } from 'lucide-react';
import { Card, PageHeader, PageFrame } from './ui/Common';

const SECTIONS = {
  de: {
    title: 'Datenschutz & Nutzungsbedingungen',
    subtitle: 'PROTOKOLL :: DATENSCHUTZ-MATRIX',
    lastUpdated: 'Letzte Aktualisierung',
    sections: [
      {
        icon: Shield,
        title: '1. Verantwortlicher & Zweck',
        content: 'DisinfoDesk ist ein Open-Source-Bildungsprojekt zur Analyse von Desinformation und Verschwörungstheorien. Die Anwendung dient ausschließlich Bildungs- und Forschungszwecken.',
        details: [
          'Kein kommerzieller Zweck — vollständig Open Source (MIT-Lizenz)',
          'Keine Registrierung oder Kontoerstellung erforderlich',
          'Hosting über GitHub Pages (statische Bereitstellung)',
        ],
      },
      {
        icon: Database,
        title: '2. Datenverarbeitung & Speicherung',
        content: 'Alle Nutzerdaten werden ausschließlich lokal im Browser gespeichert. Es findet keine serverseitige Datenerfassung oder -speicherung statt.',
        details: [
          'IndexedDB für Analysen, Chats, Satire-Inhalte und App-Status',
          'Gzip-Komprimierung + AES-256-GCM-Verschlüsselung für gespeicherte Daten',
          'API-Schlüssel werden per Web Crypto API (AES-256-GCM) in einem separaten KeyVault verschlüsselt',
          'SHA-256-Integritätsprüfung zum Schutz vor Manipulation der Verschlüsselungsschlüssel',
          'Keine Cookies, kein localStorage für sensible Daten, keine Tracker',
        ],
      },
      {
        icon: Server,
        title: '3. KI-Dienste & API-Kommunikation',
        content: 'Die Anwendung kommuniziert direkt mit KI-Anbietern über deren APIs. Es gibt keinen zwischengeschalteten Backend-Server.',
        details: [
          'Direkte Browser-zu-API-Kommunikation (kein Proxy, kein Backend)',
          'Unterstützte Anbieter: Google Gemini, xAI Grok, Anthropic Claude, Ollama (lokal), Chrome Built-in AI',
          'API-Schlüssel werden nie an Dritte übertragen — nur direkt an den gewählten Anbieter',
          'KI-Antworten sind automatisch generiert und keine faktische Beratung',
          'Jede KI-Antwort wird mit einem Haftungsausschluss versehen',
        ],
      },
      {
        icon: Lock,
        title: '4. Sicherheitsmaßnahmen',
        content: 'Die Anwendung implementiert mehrschichtige Sicherheitsmaßnahmen zum Schutz der Nutzerdaten.',
        details: [
          'Content Security Policy (CSP) in Produktion mit strikten Direktiven',
          'Permissions-Policy: Kamera, Mikrofon, Geolocation und Zahlungen deaktiviert',
          'X-Frame-Options: DENY — Schutz vor Clickjacking',
          'X-Content-Type-Options: nosniff — Schutz vor MIME-Sniffing',
          'Strict Referrer Policy: strict-origin-when-cross-origin',
          'Upgrade-Insecure-Requests: Automatische HTTPS-Umleitung',
          'Service Worker mit differenzierten Caching-Strategien',
        ],
      },
      {
        icon: Eye,
        title: '5. Keine Tracking- oder Analysedienste',
        content: 'DisinfoDesk verwendet keinerlei externe Tracking-, Analyse- oder Werbedienste.',
        details: [
          'Kein Google Analytics, kein Meta Pixel, keine Werbenetzwerke',
          'Keine Fingerprinting-Techniken',
          'DNS-Prefetch deaktiviert (X-DNS-Prefetch-Control: off)',
          'Keine Cross-Domain-Policies (X-Permitted-Cross-Domain-Policies: none)',
        ],
      },
      {
        icon: Globe,
        title: '6. Drittanbieter-Dienste',
        content: 'Die einzigen externen Verbindungen entstehen durch die vom Nutzer konfigurierten KI-Anbieter.',
        details: [
          'Google Gemini API (ai.google.dev) — wenn konfiguriert',
          'xAI Grok API (api.x.ai) — wenn konfiguriert',
          'Anthropic Claude API (api.anthropic.com) — wenn konfiguriert',
          'Ollama (lokaler Endpunkt) — wenn konfiguriert',
          'Chrome Built-in AI (lokal im Browser) — keine externe Verbindung',
          'GitHub Pages (Hosting) — Standard-Webserver-Logs durch GitHub',
        ],
      },
      {
        icon: AlertTriangle,
        title: '7. Altersverifikation & Bildungsinhalte',
        content: 'Die Anwendung behandelt potenziell verstörende Themen (Verschwörungstheorien, Desinformation) in einem bildungskritischen Kontext.',
        details: [
          'Mindestalter: 16 Jahre (Altersverifikation im Onboarding)',
          'Inhalte dienen ausschließlich der Bildung und kritischen Analyse',
          'Keine Verbreitung oder Förderung von Verschwörungstheorien',
          'KI-generierte Inhalte sind als solche gekennzeichnet',
        ],
      },
      {
        icon: Trash2,
        title: '8. Datenlöschung & Kontrolle',
        content: 'Nutzer haben volle Kontrolle über ihre lokal gespeicherten Daten.',
        details: [
          'Alle Daten können jederzeit über den Datenbank-Manager gelöscht werden',
          'Browser-Cache und IndexedDB können manuell geleert werden',
          'Kein serverseitiges Backup — gelöschte Daten sind unwiederbringlich entfernt',
          'Export/Import-Funktion für persönliche Datensicherung',
        ],
      },
      {
        icon: Mail,
        title: '9. Kontakt & Open Source',
        content: 'DisinfoDesk ist ein Open-Source-Projekt. Fragen, Anregungen und Beiträge sind willkommen.',
        details: [
          'Quellcode: GitHub Repository (MIT-Lizenz)',
          'Issues und Pull Requests über GitHub',
          'Keine personenbezogene Datenerhebung — keine DSGVO-Auskunftsanfragen notwendig',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy & Terms of Use',
    subtitle: 'PROTOCOL :: PRIVACY MATRIX',
    lastUpdated: 'Last updated',
    sections: [
      {
        icon: Shield,
        title: '1. Controller & Purpose',
        content: 'DisinfoDesk is an open-source educational project for analyzing disinformation and conspiracy theories. The application serves exclusively educational and research purposes.',
        details: [
          'No commercial purpose — fully Open Source (MIT License)',
          'No registration or account creation required',
          'Hosted via GitHub Pages (static deployment)',
        ],
      },
      {
        icon: Database,
        title: '2. Data Processing & Storage',
        content: 'All user data is stored exclusively locally in the browser. No server-side data collection or storage takes place.',
        details: [
          'IndexedDB for analyses, chats, satire content, and app state',
          'Gzip compression + AES-256-GCM encryption for stored data',
          'API keys encrypted via Web Crypto API (AES-256-GCM) in a separate KeyVault',
          'SHA-256 integrity verification to protect against encryption key tampering',
          'No cookies, no localStorage for sensitive data, no trackers',
        ],
      },
      {
        icon: Server,
        title: '3. AI Services & API Communication',
        content: 'The application communicates directly with AI providers via their APIs. There is no intermediary backend server.',
        details: [
          'Direct browser-to-API communication (no proxy, no backend)',
          'Supported providers: Google Gemini, xAI Grok, Anthropic Claude, Ollama (local), Chrome Built-in AI',
          'API keys are never transmitted to third parties — only directly to the selected provider',
          'AI responses are automatically generated and do not constitute factual advice',
          'Every AI response includes a disclaimer',
        ],
      },
      {
        icon: Lock,
        title: '4. Security Measures',
        content: 'The application implements multi-layered security measures to protect user data.',
        details: [
          'Content Security Policy (CSP) in production with strict directives',
          'Permissions-Policy: Camera, microphone, geolocation, and payments disabled',
          'X-Frame-Options: DENY — protection against clickjacking',
          'X-Content-Type-Options: nosniff — protection against MIME sniffing',
          'Strict Referrer Policy: strict-origin-when-cross-origin',
          'Upgrade-Insecure-Requests: Automatic HTTPS redirection',
          'Service Worker with differentiated caching strategies',
        ],
      },
      {
        icon: Eye,
        title: '5. No Tracking or Analytics',
        content: 'DisinfoDesk does not use any external tracking, analytics, or advertising services.',
        details: [
          'No Google Analytics, no Meta Pixel, no ad networks',
          'No fingerprinting techniques',
          'DNS Prefetch disabled (X-DNS-Prefetch-Control: off)',
          'No Cross-Domain Policies (X-Permitted-Cross-Domain-Policies: none)',
        ],
      },
      {
        icon: Globe,
        title: '6. Third-Party Services',
        content: 'The only external connections are made through the AI providers configured by the user.',
        details: [
          'Google Gemini API (ai.google.dev) — when configured',
          'xAI Grok API (api.x.ai) — when configured',
          'Anthropic Claude API (api.anthropic.com) — when configured',
          'Ollama (local endpoint) — when configured',
          'Chrome Built-in AI (local in browser) — no external connection',
          'GitHub Pages (hosting) — standard web server logs by GitHub',
        ],
      },
      {
        icon: AlertTriangle,
        title: '7. Age Verification & Educational Content',
        content: 'The application deals with potentially disturbing topics (conspiracy theories, disinformation) in an educational-critical context.',
        details: [
          'Minimum age: 16 years (age verification during onboarding)',
          'Content serves exclusively educational and critical analysis purposes',
          'No dissemination or promotion of conspiracy theories',
          'AI-generated content is labeled as such',
        ],
      },
      {
        icon: Trash2,
        title: '8. Data Deletion & Control',
        content: 'Users have full control over their locally stored data.',
        details: [
          'All data can be deleted at any time via the Database Manager',
          'Browser cache and IndexedDB can be cleared manually',
          'No server-side backup — deleted data is permanently removed',
          'Export/Import function for personal data backup',
        ],
      },
      {
        icon: Mail,
        title: '9. Contact & Open Source',
        content: 'DisinfoDesk is an open-source project. Questions, suggestions, and contributions are welcome.',
        details: [
          'Source code: GitHub Repository (MIT License)',
          'Issues and Pull Requests via GitHub',
          'No personal data collection — no GDPR data access requests necessary',
        ],
      },
    ],
  },
};

export const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const data = SECTIONS[language];

  return (
    <PageFrame>
      <PageHeader
        title={data.title}
        subtitle={data.subtitle}
        icon={Shield}
      />
      <div className="text-xs font-mono text-slate-500 mb-8 uppercase tracking-widest">
        {data.lastUpdated}: 2025-07-18
      </div>
      <div className="space-y-6 max-w-4xl">
        {data.sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} variant="glass" className="p-6 border-l-2 border-l-accent-cyan/30 hover:border-l-accent-cyan/60 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan shrink-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest font-display">{section.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{section.content}</p>
                  {section.details && (
                    <ul className="space-y-1.5 mt-3">
                      {section.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-mono">
                          <span className="text-accent-cyan mt-0.5 shrink-0">›</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageFrame>
  );
};
