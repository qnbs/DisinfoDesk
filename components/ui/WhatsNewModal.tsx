import React, { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Zap, Terminal } from 'lucide-react';
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
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
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
        <div className="relative bg-[#020617] border border-slate-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden ring-1 ring-white/5">
          {/* Cyber Background Effects */}
          <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20 z-[1]" />

          {/* Header */}
          <div className="relative z-[2] px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accent-cyan/50 via-accent-purple/30 to-transparent" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-cyan/20 blur-lg rounded-full" />
                  <div className="relative p-2 bg-slate-950 rounded-lg border border-slate-700/50">
                    <Terminal size={18} className="text-accent-cyan drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    {isDe ? "Was ist neu" : "What's New"}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-0.5">
                    {isDe ? "System-Changelog" : "System Changelog"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800/80 rounded-lg transition-colors text-slate-500 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none border border-transparent hover:border-slate-700/50"
                aria-label={isDe ? "Schließen" : "Close"}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-[2] overflow-y-auto custom-scrollbar max-h-[calc(80vh-180px)]">
            <div className="px-6 py-5">
              {/* Version Selector */}
              {CHANGELOG.length > 1 && (
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {CHANGELOG.map((entry, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVersion(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all border ${
                        selectedVersion === idx
                          ? 'bg-accent-cyan/10 text-accent-cyan font-bold border-accent-cyan/40'
                          : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 border-slate-700/50 hover:text-white'
                      }`}
                    >
                      v{entry.version}
                    </button>
                  ))}
                </div>
              )}

              {/* Version Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                  {changelog.badge && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles(changelog.badge)}`}>
                      {getBadgeIcon(changelog.badge)}
                      {changelog.badge === 'new' && (isDe ? 'NEU' : 'NEW')}
                      {changelog.badge === 'improved' && (isDe ? 'VERBESSERT' : 'IMPROVED')}
                      {changelog.badge === 'fixed' && (isDe ? 'BEHOBEN' : 'FIXED')}
                      {changelog.badge === 'security' && (isDe ? 'SICHERHEIT' : 'SECURITY')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  {isDe ? "Veröffentlicht" : "Released"} {new Date(changelog.date).toLocaleDateString(isDe ? 'de-DE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Changelog Items */}
              <ul className="space-y-2.5">
                {items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm group">
                    <span className="text-accent-cyan mt-0.5 flex-shrink-0 font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">▹</span>
                    <span className="text-slate-300 flex-1 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

              {/* Release Notes Section */}
              <div className="bg-slate-950/50 border border-slate-800/40 rounded-lg p-4 text-[11px] text-slate-500 font-mono">
                <p className="leading-relaxed">
                  {isDe
                    ? "Diese Version enthält Stabilität, Leistungs- und Sicherheitsverbesserungen. Weitere Details findest du auf GitHub."
                    : "This release includes stability, performance, and security improvements. Find more details on GitHub."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-[2] px-6 py-4 border-t border-slate-800/80 bg-slate-900/50 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-wider border border-slate-700/50 hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            >
              {isDe ? "Schließen" : "Close"}
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 hover:border-accent-cyan/50 transition-all font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            >
              {isDe ? "Verstanden" : "Got It"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
