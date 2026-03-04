import React, { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChangelogEntry {
  version: string;
  date: string;
  titleDe: string;
  titleEn: string;
  itemsDe: string[];
  itemsEn: string[];
  badge?: 'new' | 'improved' | 'fixed' | 'security';
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-03-04',
    titleDe: 'Offizielle Veröffentlichung',
    titleEn: 'Official Release',
    badge: 'new',
    itemsDe: [
      'Vollständige Medienkultur-Bibliothek mit über 100 Referenzen',
      'KI-gestützte Debunk-Chat mit Echtzeit-Analyse',
      'Satire-Generator für Narrative-Experimente',
      'Offline-First PWA mit IndexedDB-Speicherung',
      'Vollständige DE/EN-Lokalisierung',
      'Fortgeschrittene Visuals (Netzwerk, Zeitstrahl, Verbreitungsanalyse)',
    ],
    itemsEn: [
      'Complete media culture library with 100+ references',
      'AI-powered debunk chat with real-time analysis',
      'Satire generator for narrative experiments',
      'Offline-first PWA with IndexedDB storage',
      'Full DE/EN localization',
      'Advanced visualizations (network, timeline, virality)',
    ],
  },
];

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose, onDismiss }) => {
  const { language } = useLanguage();
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const changelog = CHANGELOG[selectedVersion];
  const isDe = language === 'de';
  const items = isDe ? changelog.itemsDe : changelog.itemsEn;
  const title = isDe ? changelog.titleDe : changelog.titleEn;

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'new':
        return 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40';
      case 'improved':
        return 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40';
      case 'fixed':
        return 'bg-success-green/20 text-success-green border border-success-green/40';
      case 'security':
        return 'bg-danger-red/20 text-danger-red border border-danger-red/40';
      default:
        return '';
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'new':
        return <Sparkles size={12} className="mr-1" />;
      case 'improved':
        return <Zap size={12} className="mr-1" />;
      case 'fixed':
        return <CheckCircle2 size={12} className="mr-1" />;
      case 'security':
        return <AlertCircle size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <dialog
        open={isOpen}
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 no-print ${
          animate ? 'animate-fade-in-scale' : ''
        }`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden glass-panel-elevated">
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-transparent">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accent-cyan/40 to-transparent" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
                  <Sparkles size={20} className="text-accent-cyan" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isDe ? "Was ist neu" : "What's New"}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {isDe ? "Neue Features & Verbesserungen" : "New Features & Improvements"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
                aria-label={isDe ? "Schließen" : "Close"}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto custom-scrollbar max-h-[calc(80vh-180px)]">
            <div className="px-6 py-5">
              {/* Version Selector */}
              {CHANGELOG.length > 1 && (
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {CHANGELOG.map((entry, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVersion(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                        selectedVersion === idx
                          ? 'bg-accent-cyan text-black font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      v{entry.version}
                    </button>
                  ))}
                </div>
              )}

              {/* Version Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  {changelog.badge && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(changelog.badge)}`}>
                      {getBadgeIcon(changelog.badge)}
                      {changelog.badge === 'new' && (isDe ? 'NEU' : 'NEW')}
                      {changelog.badge === 'improved' && (isDe ? 'VERBESSERT' : 'IMPROVED')}
                      {changelog.badge === 'fixed' && (isDe ? 'BEHOBEN' : 'FIXED')}
                      {changelog.badge === 'security' && (isDe ? 'SICHERHEIT' : 'SECURITY')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {isDe ? "Veröffentlicht am" : "Released on"} {new Date(changelog.date).toLocaleDateString(isDe ? 'de-DE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Changelog Items */}
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="text-accent-cyan mt-1 flex-shrink-0">▸</span>
                    <span className="text-slate-300 flex-1">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

              {/* Release Notes Section */}
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-xs text-slate-400">
                <p className="leading-relaxed">
                  {isDe
                    ? "Diese Version enthält Stabilität, Leistungs- und Sicherheitsverbesserungen. Weitere Details findest du auf GitHub."
                    : "This release includes stability, performance, and security improvements. Find more details on GitHub."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800/50 bg-gradient-to-t from-slate-900/30 to-transparent flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-medium text-sm focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            >
              {isDe ? "Schließen" : "Close"}
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 hover:border-accent-cyan/50 transition-all font-medium text-sm focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            >
              {isDe ? "Verstanden" : "Got It"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
