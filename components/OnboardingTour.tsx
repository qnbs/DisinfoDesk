import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { completeOnboarding, setLanguage as setReduxLanguage } from '../store/slices/settingsSlice';
import { Button, Card } from './ui/Common';
import { Terminal, ArrowRight, ShieldCheck, Search, MessageSquare, LayoutDashboard, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Step {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  highlightId?: string; // ID of the DOM element to highlight
}

// --- 1. Logic Hook ---

const useOnboardingLogic = () => {
  const dispatch = useAppDispatch();
  const hasSeenOnboarding = useAppSelector(state => state.settings.config.hasSeenOnboarding);
  const { t, language, setLanguage } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [coords, setCoords] = useState<{top: number, left: number, width: number, height: number} | null>(null);

  const TOUR_STEPS: Step[] = useMemo(() => [
    {
      id: 0,
      title: t.onboarding.step0.title,
      message: t.onboarding.step0.msg,
      icon: <Globe size={32} className="text-white" />,
    },
    {
      id: 1,
      title: t.onboarding.step1.title,
      message: t.onboarding.step1.msg,
      icon: <Terminal size={32} className="text-accent-cyan" />,
    },
    {
      id: 2,
      title: t.onboarding.step2.title,
      message: t.onboarding.step2.msg,
      icon: <LayoutDashboard size={32} className="text-accent-purple" />,
      highlightId: "nav-sidebar"
    },
    {
      id: 3,
      title: t.onboarding.step3.title,
      message: t.onboarding.step3.msg,
      icon: <Search size={32} className="text-accent-cyan" />,
      highlightId: "nav-search"
    },
    {
      id: 4,
      title: t.onboarding.step4.title,
      message: t.onboarding.step4.msg,
      icon: <MessageSquare size={32} className="text-green-400" />,
      highlightId: "nav-chat"
    }
  ], [t]);

  const currentStep = TOUR_STEPS[stepIndex];

  // Effect to calculate highlight coordinates
  useEffect(() => {
    if (hasSeenOnboarding) return;
    
    if (currentStep.highlightId) {
      const el = document.getElementById(currentStep.highlightId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        // Fallback if element not found (e.g. mobile view mismatch)
        setCoords(null);
      }
    } else {
      setCoords(null);
    }
  }, [stepIndex, currentStep.highlightId, hasSeenOnboarding, currentStep]);

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    dispatch(completeOnboarding());
  };

  const handleLanguageSelect = (lang: 'de' | 'en') => {
    setLanguage(lang); // Updates Context
    dispatch(setReduxLanguage(lang)); // Syncs Redux store
  };

  return {
    hasSeenOnboarding,
    stepIndex,
    TOUR_STEPS,
    currentStep,
    coords,
    handleNext,
    handleSkip,
    handleLanguageSelect,
    t,
    language
  };
};

// --- 2. Context & Provider ---

type OnboardingContextType = ReturnType<typeof useOnboardingLogic>;
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error('useOnboarding must be used within a OnboardingProvider');
    return context;
};

const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const logic = useOnboardingLogic();
    return <OnboardingContext.Provider value={logic}>{children}</OnboardingContext.Provider>;
};

// --- 3. Sub-Components ---

const HighlightBox: React.FC = () => {
    const { coords } = useOnboarding();
    if (!coords) return null;

    return (
        <div 
          className="absolute border-2 border-accent-cyan rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-500 ease-in-out box-content pointer-events-none z-10"
          style={{
            top: coords.top - 10,
            left: coords.left - 10,
            width: coords.width + 20,
            height: coords.height + 20,
          }}
        >
            <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] font-bold text-accent-cyan uppercase tracking-widest border border-accent-cyan">
                Active Zone
            </div>
        </div>
    );
};

const TourCard: React.FC = () => {
    const { currentStep, stepIndex, TOUR_STEPS, handleLanguageSelect, handleNext, handleSkip, t, language } = useOnboarding();

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <Card className="pointer-events-auto w-full max-w-md bg-slate-900 border-2 border-slate-700 shadow-2xl relative overflow-hidden animate-fade-in flex flex-col gap-6 p-8">
                
                {/* Decorative BG */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-cyan"></div>

                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg mb-2">
                        {currentStep.icon}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                            {currentStep.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                            {currentStep.message}
                        </p>
                    </div>

                    {/* Step 0: Language Selection UI */}
                    {stepIndex === 0 && (
                    <div className="flex gap-4 w-full justify-center py-2">
                        <button 
                        onClick={() => handleLanguageSelect('de')}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-24 h-24
                            ${language === 'de' 
                            ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'}
                        `}
                        >
                        <span className="text-2xl mb-1">🇩🇪</span>
                        <span className={`text-xs font-bold font-mono uppercase ${language === 'de' ? 'text-accent-cyan' : 'text-slate-400'}`}>
                            Deutsch
                        </span>
                        </button>
                        
                        <button 
                        onClick={() => handleLanguageSelect('en')}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-24 h-24
                            ${language === 'en' 
                            ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'}
                        `}
                        >
                        <span className="text-2xl mb-1">🇺🇸</span>
                        <span className={`text-xs font-bold font-mono uppercase ${language === 'en' ? 'text-accent-cyan' : 'text-slate-400'}`}>
                            English
                        </span>
                        </button>
                    </div>
                    )}

                    <div className="flex gap-2 mt-4 w-full">
                        <Button variant="ghost" onClick={handleSkip} className="flex-1 text-xs text-slate-500 hover:text-white">
                            {t.onboarding.skip}
                        </Button>
                        <Button variant="primary" onClick={handleNext} className="flex-[2]" icon={stepIndex === TOUR_STEPS.length - 1 ? <ShieldCheck size={16}/> : <ArrowRight size={16}/>}>
                            {stepIndex === TOUR_STEPS.length - 1 ? t.onboarding.init : t.onboarding.next}
                        </Button>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-2">
                    {TOUR_STEPS.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all ${idx === stepIndex ? 'bg-accent-cyan w-6' : 'bg-slate-800'}`}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
};

const TourOverlay: React.FC = () => {
    const { hasSeenOnboarding } = useOnboarding();
    if (hasSeenOnboarding) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col transition-all duration-500">
            {/* Background Dimmer with Cutout logic */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500"></div>
            <HighlightBox />
            <TourCard />
        </div>
    );
};

// --- 4. Main Component ---

export const OnboardingTour: React.FC = () => {
  return (
      <OnboardingProvider>
          <TourOverlay />
      </OnboardingProvider>
  );
};