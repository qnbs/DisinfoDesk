import React from 'react';
import { X, ExternalLink, Link2 } from 'lucide-react';
import { Card, Button } from './Common';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ReferenceItem {
  title: string;
  url?: string;
  snippet?: string;
  sourceType?: string;
}

interface ReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  references: ReferenceItem[];
}

export const ReferencesModal: React.FC<ReferencesModalProps> = ({ isOpen, onClose, title, references }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.detail.references}
    >
      <Card
        className="w-full max-w-3xl max-h-[80vh] overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500">{t.detail.sourceMatrix}</div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={14} />}>
            {t.common.close}
          </Button>
        </div>

        <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(80vh-88px)] space-y-3">
          {references.length === 0 ? (
            <div className="text-sm text-slate-500">{t.detail.noReferences}</div>
          ) : (
            references.map((ref, idx) => (
              <div key={`${ref.title}-${idx}`} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-accent-cyan">
                    {ref.url ? <ExternalLink size={14} /> : <Link2 size={14} />}
                  </div>
                  <div className="min-w-0">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-200 hover:text-white underline break-words"
                      >
                        {ref.title}
                      </a>
                    ) : (
                      <div className="text-sm text-slate-300 break-words">{ref.title}</div>
                    )}
                    {ref.sourceType && <div className="text-[10px] text-slate-500 mt-1 font-mono">{ref.sourceType}</div>}
                    {ref.snippet && <div className="text-xs text-slate-400 mt-2">{ref.snippet}</div>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReferencesModal;