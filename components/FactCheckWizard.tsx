
import React, {
  useState, useCallback, useMemo, createContext, useContext, useRef, useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, ArrowLeft, CheckCircle2, Download, AlertTriangle, ShieldCheck, FileText, Brain, ClipboardList, BarChart3, Award, ExternalLink, ChevronRight
} from 'lucide-react';
import {
  Button, Card, PageHeader, PageFrame, Badge
} from './ui/Common';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { THEORIES_DE_FULL, THEORIES_EN_FULL } from '../constants';
import { useAnalyzeTheoryQuery } from '../store/api/aiApi';
import { dbService } from '../services/dbService';
import { playSound, haptic } from '../utils/microInteractions';
import { downloadFactCheckReport, FactCheckReport } from '../utils/factCheckReport';

// --- Types ---
type WizardStep = 'INPUT' | 'ANALYSIS' | 'VERDICT' | 'EXPORT';

interface WizardState {
  step: WizardStep;
  theoryId: string | null;
  customQuery: string;
  analysisTriggered: boolean;
}

// --- 1. Logic Hook ---

const useWizardLogic = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const settings = useAppSelector(state => state.settings.config);
  const theories = language === 'de' ? THEORIES_DE_FULL : THEORIES_EN_FULL;

  const [state, setState] = useState<WizardState>({
    step: 'INPUT',
    theoryId: null,
    customQuery: '',
    analysisTriggered: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const selectedTheory = useMemo(() => 
    state.theoryId ? theories.find(t => t.id === state.theoryId) : null
  , [state.theoryId, theories]);

  const filteredTheories = useMemo(() => {
    if (!searchQuery.trim()) return theories.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return theories.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.shortDescription.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [theories, searchQuery]);

  // RTK Query for analysis - only triggered when analysisTriggered is true
  const { data: analysis, isLoading: analysisLoading, error: analysisError } = useAnalyzeTheoryQuery(
    {
      theory: selectedTheory!,
      language,
      model: settings.aiModelVersion,
      temp: settings.aiTemperature,
      budget: settings.thinkingBudget,
    },
    { skip: !state.analysisTriggered || !selectedTheory }
  );

  const steps: WizardStep[] = useMemo(() => ['INPUT', 'ANALYSIS', 'VERDICT', 'EXPORT'], []);
  const currentStepIndex = steps.indexOf(state.step);
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  const stepLabels = useMemo(() => ({
    INPUT: language === 'de' ? 'Theorie auswählen' : 'Select Theory',
    ANALYSIS: language === 'de' ? 'KI-Analyse' : 'AI Analysis',
    VERDICT: language === 'de' ? 'Urteil' : 'Verdict',
    EXPORT: language === 'de' ? 'Export' : 'Export',
  }), [language]);

  const goNext = useCallback(() => {
    const idx = steps.indexOf(state.step);
    if (idx < steps.length - 1) {
      const nextStep = steps[idx + 1];
      if (nextStep === 'ANALYSIS' && selectedTheory && !state.analysisTriggered) {
        setState(prev => ({ ...prev, step: nextStep, analysisTriggered: true }));
      } else {
        setState(prev => ({ ...prev, step: nextStep }));
      }
      playSound('click', settings.soundEnabled);
      haptic('light');
    }
  }, [state.step, selectedTheory, state.analysisTriggered, settings.soundEnabled, steps]);

  const goBack = useCallback(() => {
    const idx = steps.indexOf(state.step);
    if (idx > 0) {
      setState(prev => ({ ...prev, step: steps[idx - 1] }));
      playSound('click', settings.soundEnabled);
    }
  }, [state.step, settings.soundEnabled, steps]);

  const selectTheory = useCallback((id: string) => {
    setState(prev => ({ ...prev, theoryId: id }));
    playSound('click', settings.soundEnabled);
    haptic('light');
  }, [settings.soundEnabled]);

  const canGoNext = useMemo(() => {
    switch (state.step) {
      case 'INPUT': return !!state.theoryId;
      case 'ANALYSIS': return !!analysis && !analysisLoading;
      case 'VERDICT': return !!analysis;
      case 'EXPORT': return false;
      default: return false;
    }
  }, [state.step, state.theoryId, analysis, analysisLoading]);

  const handleExportJSON = useCallback(() => {
    if (!analysis || !selectedTheory) return;
    const findings = [analysis.originStory, analysis.scientificConsensus].filter(Boolean);
    const report: FactCheckReport = {
      generatedAt: new Date().toISOString(),
      reportType: 'THEORY',
      id: selectedTheory.id,
      title: selectedTheory.title,
      language,
      summary: analysis.debunking || analysis.fullDescription,
      findings,
      references: (analysis.sources || []).map(s => ({ title: s.title, url: s.url })),
      disclaimer: language === 'de' 
        ? 'Automatisch generiert. Keine journalistische Quelle.'
        : 'Auto-generated. Not a journalistic source.',
    };
    downloadFactCheckReport(report);
    playSound('success', settings.soundEnabled);
  }, [analysis, selectedTheory, language, settings.soundEnabled]);

  const handleSaveAnalysis = useCallback(async () => {
    if (!analysis || !selectedTheory) return;
    const id = `fc_${selectedTheory.id}_${Date.now()}`;
    await dbService.saveAnalysis({
      id,
      title: selectedTheory.title,
      timestamp: Date.now(),
      data: analysis,
      language,
    });
    setSavedId(id);
    playSound('success', settings.soundEnabled);
  }, [analysis, selectedTheory, language, settings.soundEnabled]);

  const handleReset = useCallback(() => {
    setState({ step: 'INPUT', theoryId: null, customQuery: '', analysisTriggered: false });
    setSavedId(null);
    setSearchQuery('');
  }, []);

  return {
    state, selectedTheory, filteredTheories, analysis, analysisLoading, analysisError,
    steps, currentStepIndex, progressPercent, stepLabels, canGoNext, savedId,
    searchQuery, setSearchQuery, selectTheory, goNext, goBack, handleExportJSON,
    handleSaveAnalysis, handleReset, navigate, t, language, settings
  };
};

// --- 2. Context ---
type WizardContextType = ReturnType<typeof useWizardLogic>;
const WizardContext = createContext<WizardContextType | undefined>(undefined);
const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be within WizardProvider');
  return ctx;
};

// --- 3. Sub-Components ---

const ProgressBar: React.FC = () => {
  const { steps, currentStepIndex, stepLabels } = useWizard();
  return (
    <div className="mb-8">
      {/* Mobile: simple bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest">
            {stepLabels[steps[currentStepIndex]]}
          </span>
          <span className="text-[10px] font-mono text-slate-500">{currentStepIndex + 1}/{steps.length}</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-8 right-8 h-px bg-slate-800" />
        <div 
          className="absolute top-5 left-8 h-px bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-700"
          style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * (100 - 8))}%` }}
        />

        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isComplete = idx < currentStepIndex;
          return (
            <div key={step} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isComplete ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan' : 
                  isActive ? 'bg-accent-purple/20 border-accent-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 
                  'bg-slate-900 border-slate-700 text-slate-600'}
              `}>
                {isComplete ? <CheckCircle2 size={18} /> : 
                 idx === 0 ? <Search size={16} /> :
                 idx === 1 ? <Brain size={16} /> :
                 idx === 2 ? <Award size={16} /> :
                 <Download size={16} />}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                isActive ? 'text-white font-bold' : isComplete ? 'text-accent-cyan' : 'text-slate-600'
              }`}>{stepLabels[step]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InputStep: React.FC = () => {
  const { filteredTheories, searchQuery, setSearchQuery, selectTheory, state, language } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
          {language === 'de' ? 'Theorie auswählen' : 'Select a Theory'}
        </h2>
        <p className="text-sm text-slate-400 font-mono">
          {language === 'de' ? 'Wählen Sie eine Theorie für den Faktencheck.' : 'Choose a theory for fact-checking.'}
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'de' ? 'Theorie suchen...' : 'Search theories...'}
          className="w-full bg-slate-900/70 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredTheories.map(theory => (
          <button
            key={theory.id}
            onClick={() => selectTheory(theory.id)}
            className={`
              text-left p-4 rounded-xl border transition-all group relative overflow-hidden
              ${state.theoryId === theory.id 
                ? 'bg-accent-cyan/10 border-accent-cyan ring-1 ring-accent-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${state.theoryId === theory.id ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-slate-800 text-slate-500'}`}>
                <FileText size={14} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate mb-1">{theory.title}</div>
                <div className="text-[10px] text-slate-500 font-mono line-clamp-2">{theory.shortDescription}</div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {theory.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} label={tag} className="text-[8px] py-0 px-1.5" />
                  ))}
                </div>
              </div>
              {state.theoryId === theory.id && (
                <CheckCircle2 size={16} className="text-accent-cyan flex-shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const AnalysisStep: React.FC = () => {
  const { analysis, analysisLoading, analysisError, selectedTheory, language } = useWizard();

  if (analysisLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-slate-800 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-accent-cyan rounded-full animate-spin" />
          <div className="absolute inset-2 border-t border-accent-purple/50 rounded-full animate-spin-reverse" />
          <Brain size={24} className="absolute inset-0 m-auto text-accent-cyan animate-pulse" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white uppercase tracking-widest mb-2">
            {language === 'de' ? 'KI-Analyse läuft' : 'AI Analysis Running'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {language === 'de' ? 'Gemini durchsucht Quellen...' : 'Gemini searching sources...'}
          </div>
        </div>
        <div className="flex gap-2">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="h-1.5 w-8 rounded-full shimmer-loading" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (analysisError) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16 gap-4 text-center">
        <AlertTriangle size={48} className="text-red-400" />
        <div className="text-sm font-bold text-red-400 uppercase">
          {language === 'de' ? 'Analyse fehlgeschlagen' : 'Analysis Failed'}
        </div>
        <p className="text-xs text-slate-500 font-mono max-w-sm">
          {language === 'de' ? 'Bitte prüfen Sie Ihren API-Key in den Einstellungen.' : 'Please check your API key in settings.'}
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  const summaryText = analysis.debunking || analysis.fullDescription;
  const findings = [analysis.originStory, analysis.scientificConsensus].filter(Boolean);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-4">
        <Badge label={selectedTheory?.category || ''} className="mb-2" />
        <h2 className="text-lg font-black text-white uppercase tracking-tight">{selectedTheory?.title}</h2>
      </div>

      {summaryText && (
        <Card variant="glass" className="p-5">
          <h3 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
            <ClipboardList size={12} /> {language === 'de' ? 'ZUSAMMENFASSUNG' : 'SUMMARY'}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{summaryText}</p>
        </Card>
      )}

      {findings.length > 0 && (
        <Card variant="glass" className="p-5">
          <h3 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
            <BarChart3 size={12} /> {language === 'de' ? 'BEFUNDE' : 'FINDINGS'}
          </h3>
          <ul className="space-y-3">
            {findings.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <ChevronRight size={14} className="text-accent-purple flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

const VerdictStep: React.FC = () => {
  const { analysis, selectedTheory, language } = useWizard();
  if (!analysis) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border-2 text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10 mb-4">
          <ShieldCheck size={28} />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-70">
              {language === 'de' ? 'URTEIL' : 'VERDICT'}
            </div>
            <div className="text-xl font-black uppercase tracking-wider">
              {language === 'de' ? 'ANALYSE ABGESCHLOSSEN' : 'ANALYSIS COMPLETE'}
            </div>
          </div>
        </div>
        <h3 className="text-sm text-slate-400 font-mono">{selectedTheory?.title}</h3>
      </div>

      <Card variant="glass" className="p-5">
        <h3 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
          <ClipboardList size={12} /> {language === 'de' ? 'FAKTENLAGE' : 'FACT CHECK'}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{analysis.debunking}</p>
      </Card>

      {analysis.sources && analysis.sources.length > 0 && (
        <Card variant="glass" className="p-5">
          <h3 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
            <ExternalLink size={12} /> {language === 'de' ? 'QUELLEN' : 'SOURCES'}
          </h3>
          <div className="space-y-2">
            {analysis.sources.slice(0, 5).map((src, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-slate-600 font-mono">[{idx + 1}]</span>
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline truncate">{src.title}</a>
                ) : (
                  <span className="text-slate-400">{src.title}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const ExportStep: React.FC = () => {
  const { handleExportJSON, handleSaveAnalysis, handleReset, savedId, selectedTheory, language, navigate } = useWizard();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
          {language === 'de' ? 'Analyse abgeschlossen' : 'Analysis Complete'}
        </h2>
        <p className="text-sm text-slate-400 font-mono">{selectedTheory?.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExportJSON}
          className="p-5 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-accent-cyan hover:bg-accent-cyan/5 transition-all group text-left"
        >
          <Download size={24} className="text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
          <div className="text-sm font-bold text-white mb-1">
            {language === 'de' ? 'JSON exportieren' : 'Export JSON'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {language === 'de' ? 'Standardformat für weitere Analyse' : 'Standard format for further analysis'}
          </div>
        </button>

        <button
          onClick={handleSaveAnalysis}
          disabled={!!savedId}
          className={`p-5 rounded-xl border transition-all group text-left ${
            savedId 
              ? 'border-green-500/30 bg-green-500/5 cursor-default' 
              : 'border-slate-700 bg-slate-900/50 hover:border-accent-purple hover:bg-accent-purple/5'
          }`}
        >
          {savedId ? (
            <CheckCircle2 size={24} className="text-green-400 mb-3" />
          ) : (
            <FileText size={24} className="text-accent-purple mb-3 group-hover:scale-110 transition-transform" />
          )}
          <div className="text-sm font-bold text-white mb-1">
            {savedId 
              ? (language === 'de' ? 'Gespeichert ✓' : 'Saved ✓')
              : (language === 'de' ? 'In Meine Analysen speichern' : 'Save to My Analyses')
            }
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {language === 'de' ? 'Lokal verschlüsselt im Tresor' : 'Locally encrypted in vault'}
          </div>
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={handleReset} className="flex-1">
          {language === 'de' ? 'Neuer Check' : 'New Check'}
        </Button>
        <Button variant="primary" onClick={() => navigate('/analyses')} className="flex-1" icon={<ArrowRight size={16} />}>
          {language === 'de' ? 'Meine Analysen' : 'My Analyses'}
        </Button>
      </div>
    </div>
  );
};

const WizardNavigation: React.FC = () => {
  const { goBack, goNext, canGoNext, currentStepIndex, steps, state, language } = useWizard();

  if (state.step === 'EXPORT') return null;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-slate-800/50 mt-8">
      <Button
        variant="ghost"
        onClick={goBack}
        disabled={currentStepIndex === 0}
        icon={<ArrowLeft size={16} />}
        className="text-xs"
      >
        {language === 'de' ? 'Zurück' : 'Back'}
      </Button>
      <div className="text-[10px] font-mono text-slate-600">
        {currentStepIndex + 1} / {steps.length}
      </div>
      <Button
        variant="primary"
        onClick={goNext}
        disabled={!canGoNext}
        icon={<ArrowRight size={16} />}
        className="text-xs shadow-neon-cyan"
      >
        {language === 'de' ? 'Weiter' : 'Next'}
      </Button>
    </div>
  );
};

// --- 4. Main Component ---

export const FactCheckWizard: React.FC = () => {
  const logic = useWizardLogic();
  const { language } = logic;

  return (
    <WizardContext.Provider value={logic}>
      <PageFrame>
        <PageHeader
          icon={ShieldCheck}
          title={language === 'de' ? 'Faktencheck-Assistent' : 'Fact-Check Wizard'}
          subtitle={language === 'de' ? 'Geführter Faktencheck in 4 Schritten' : 'Guided fact-check in 4 steps'}
        />

        <Card variant="elevated" className="p-6 md:p-8 max-w-3xl mx-auto">
          <ProgressBar />

          {logic.state.step === 'INPUT' && <InputStep />}
          {logic.state.step === 'ANALYSIS' && <AnalysisStep />}
          {logic.state.step === 'VERDICT' && <VerdictStep />}
          {logic.state.step === 'EXPORT' && <ExportStep />}

          <WizardNavigation />
        </Card>
      </PageFrame>
    </WizardContext.Provider>
  );
};
