
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { completeOnboarding, setLanguage as setReduxLanguage, setAgeConsent, setPrivacyAccepted } from '../store/slices/settingsSlice';
import { Button, Card } from './ui/Common';
import { Terminal, ArrowRight, ShieldCheck, Search, MessageSquare, LayoutDashboard, Globe, Check, AlertTriangle, FileText } from 'lucide-react';
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
  const [isBooting, setIsBooting] = useState(true);
  const [coords, setCoords] = useState<{top: number, left: number, width: number, height: number} | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Skip boot if already seen
  useEffect(() => {
      if (hasSeenOnboarding) setIsBooting(false);
  }, [hasSeenOnboarding]);

  const TOUR_STEPS: Step[] = useMemo(() => [
    {
      id: 0,
      title: t.onboarding.step0.title,
      message: t.onboarding.step0.msg,
      icon: <Globe size={32} className="text-white" />,
    },
    {
      id: 1,
      title: language === 'de' ? 'ALTERSVERIFIKATION' : 'AGE VERIFICATION',
      message: language === 'de'
        ? 'Diese App enthält Inhalte über Verschwörungstheorien und Desinformation zu Bildungszwecken. Du musst mindestens 16 Jahre alt sein, um fortzufahren.'
        : 'This app contains content about conspiracy theories and disinformation for educational purposes. You must be at least 16 years old to continue.',
      icon: <AlertTriangle size={32} className="text-amber-400" />,
    },
    {
      id: 2,
      title: language === 'de' ? 'DATENSCHUTZ' : 'PRIVACY',
      message: language === 'de'
        ? 'Deine Daten bleiben auf deinem Gerät. API-Keys werden mit AES-256-GCM verschlüsselt. KI-Antworten sind maschinell generiert und keine Fakten. Bitte lies unsere Datenschutzerklärung.'
        : 'Your data stays on your device. API keys are AES-256-GCM encrypted. AI responses are machine-generated and not factual. Please read our Privacy Policy.',
      icon: <FileText size={32} className="text-green-400" />,
    },
    {
      id: 3,
      title: t.onboarding.step1.title,
      message: t.onboarding.step1.msg,
      icon: <Terminal size={32} className="text-accent-cyan" />,
    },
    {
      id: 4,
      title: t.onboarding.step2.title,
      message: t.onboarding.step2.msg,
      icon: <LayoutDashboard size={32} className="text-accent-purple" />,
      highlightId: "nav-sidebar"
    },
    {
      id: 5,
      title: t.onboarding.step3.title,
      message: t.onboarding.step3.msg,
      icon: <Search size={32} className="text-accent-cyan" />,
      highlightId: "nav-search"
    },
    {
      id: 6,
      title: t.onboarding.step4.title,
      message: t.onboarding.step4.msg,
      icon: <MessageSquare size={32} className="text-green-400" />,
      highlightId: "nav-chat"
    }
  ], [t, language]);

  const currentStep = TOUR_STEPS[stepIndex];

  // Effect to calculate highlight coordinates
  useEffect(() => {
    if (hasSeenOnboarding || isBooting) return;
    
    // Tiny delay to allow UI to settle if coming from boot
    const timer = setTimeout(() => {
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
            setCoords(null);
        }
        } else {
        setCoords(null);
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [stepIndex, currentStep.highlightId, hasSeenOnboarding, isBooting, currentStep]);

  const handleNext = () => {
    // Step 1 = age gate — must confirm before proceeding
    if (stepIndex === 1 && !ageConfirmed) return;
    // Step 2 = privacy — must accept before proceeding
    if (stepIndex === 2 && !privacyAccepted) return;

    if (stepIndex === 1) dispatch(setAgeConsent());
    if (stepIndex === 2) dispatch(setPrivacyAccepted());

    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    // Cannot skip age gate and privacy steps
    if (stepIndex <= 2) return;
    dispatch(completeOnboarding());
  };

  const handleLanguageSelect = (lang: 'de' | 'en') => {
    setLanguage(lang); // Updates Context
    dispatch(setReduxLanguage(lang)); // Syncs Redux store
  };

  const finishBoot = () => setIsBooting(false);

  return {
    hasSeenOnboarding,
    isBooting,
    finishBoot,
    stepIndex,
    TOUR_STEPS,
    currentStep,
    coords,
    handleNext,
    handleSkip,
    handleLanguageSelect,
    ageConfirmed,
    setAgeConfirmed,
    privacyAccepted,
    setPrivacyAccepted,
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

const BootSequence: React.FC = () => {
    const { finishBoot } = useOnboarding();
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        const sequence = [
            "Initializing DisinfoDesk Kernel v2.7...",
            "Loading Neural Modules...",
            "Connecting to Gemini 2.5 Node...",
            "Encrypting Local Vault...",
            "Identity Confirmed.",
            "Welcome, Agent."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setLines(prev => [...prev, sequence[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(finishBoot, 1200); // Slightly longer pause at end
            }
        }, 500); // Pace

        return () => clearInterval(interval);
    }, [finishBoot]);

    return (
        <div className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col justify-center items-center p-6 font-mono select-none overflow-hidden cursor-wait">
            {/* Improved Background - Cyber-Mystic Theme */}
            <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-[0.05] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#020617] to-[#020617] pointer-events-none"></div>
            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none"></div>
            
            {/* Terminal Window */}
            <div className="max-w-2xl w-full relative z-10 animate-fade-in-up">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 blur-2xl opacity-40"></div>
                
                <div className="relative border border-slate-700/50 bg-[#020617]/90 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                            <Terminal size={12} className="text-accent-cyan" />
                            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-[0.2em]">DisinfoDesk OS // Boot</span>
                        </div>
                        <div className="w-10"></div> 
                    </div>

                    {/* Content Area */}
                    <div className="p-8 min-h-[360px] flex flex-col justify-end space-y-2 font-mono text-sm leading-relaxed relative">
                        {/* CRT Scanline Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

                        {lines.map((line, idx) => {
                            let colorClass = "text-slate-400";
                            let prefix = ">";
                            let shadowClass = "";
                            
                            // Robust check for undefined to prevent crashes
                            const text = line || "";
                            
                            if (text.includes("Initializing")) { 
                                colorClass = "text-accent-cyan font-bold"; 
                                shadowClass = "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]";
                            }
                            else if (text.includes("Neural")) { 
                                colorClass = "text-accent-purple"; 
                                prefix = "∿"; 
                                shadowClass = "drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]";
                            }
                            else if (text.includes("Gemini")) { 
                                colorClass = "text-accent-purple font-semibold"; 
                                prefix = "✦"; 
                                shadowClass = "drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]";
                            }
                            else if (text.includes("Encrypting")) { 
                                colorClass = "text-slate-300"; 
                                prefix = "🔒"; 
                            }
                            else if (text.includes("Confirmed")) { 
                                colorClass = "text-green-400 font-bold"; 
                                prefix = "✓"; 
                                shadowClass = "drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]";
                            }
                            else if (text.includes("Welcome")) { 
                                colorClass = "text-white font-black text-xl tracking-widest mt-6 pt-6 border-t border-slate-800/50 block"; 
                                prefix = ""; 
                                shadowClass = "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]";
                            }

                            return (
                                <div key={idx} className={`flex items-start gap-3 ${colorClass} ${shadowClass} animate-fade-in`}>
                                    {!text.includes("Welcome") && (
                                        <span className="text-slate-600 text-[10px] shrink-0 pt-1 font-normal select-none w-16 text-right">
                                            [{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2">
                                        {prefix && <span className="opacity-50 inline-block w-4 text-center">{prefix}</span>}
                                        {text}
                                    </span>
                                </div>
                            );
                        })}
                        
                        {/* Cursor */}
                        <div className="flex items-center gap-3 mt-1 pl-[calc(4rem+12px)]">
                            <span className="text-accent-cyan text-sm animate-pulse">_</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Footer */}
                <div className="flex justify-between items-center mt-4 px-2 opacity-40 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>Mem: 64TB OK</span>
                    <span>Uplink: Secure</span>
                </div>
            </div>
        </div>
    );
};

// Tactical SVG Reticle
const HighlightReticle: React.FC = () => {
    const { coords } = useOnboarding();
    if (!coords) return null;

    const padding = 10;
    const x = coords.left - padding;
    const y = coords.top - padding;
    const w = coords.width + (padding * 2);
    const h = coords.height + (padding * 2);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-hidden">
            <svg className="absolute w-full h-full" style={{ left: 0, top: 0 }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g style={{ transition: 'all 0.5s ease-in-out' }}>
                    {/* Top Left Corner */}
                    <path d={`M ${x} ${y+20} L ${x} ${y} L ${x+20} ${y}`} stroke="#06b6d4" strokeWidth="2" fill="none" filter="url(#glow)" />
                    {/* Top Right Corner */}
                    <path d={`M ${x+w-20} ${y} L ${x+w} ${y} L ${x+w} ${y+20}`} stroke="#06b6d4" strokeWidth="2" fill="none" filter="url(#glow)" />
                    {/* Bottom Left Corner */}
                    <path d={`M ${x} ${y+h-20} L ${x} ${y+h} L ${x+20} ${y+h}`} stroke="#06b6d4" strokeWidth="2" fill="none" filter="url(#glow)" />
                    {/* Bottom Right Corner */}
                    <path d={`M ${x+w-20} ${y+h} L ${x+w} ${y+h} L ${x+w} ${y+h-20}`} stroke="#06b6d4" strokeWidth="2" fill="none" filter="url(#glow)" />
                    
                    {/* Target Label */}
                    <rect x={x} y={y - 25} width="80" height="20" fill="#06b6d4" opacity="0.8" />
                    <text x={x + 5} y={y - 11} fill="black" fontSize="10" fontWeight="bold" fontFamily="monospace">TARGET_LOCK</text>
                </g>
            </svg>
        </div>
    );
};

const TourCard: React.FC = () => {
    const { currentStep, stepIndex, TOUR_STEPS, handleLanguageSelect, handleNext, handleSkip, t, language, ageConfirmed, setAgeConfirmed, privacyAccepted, setPrivacyAccepted } = useOnboarding();

    const canProceed = stepIndex === 1 ? ageConfirmed : stepIndex === 2 ? privacyAccepted : true;
    const canSkip = stepIndex > 2;

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none z-30">
            <Card className="pointer-events-auto w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in-up flex flex-col p-0" role="dialog" aria-modal="true" aria-label="Onboarding Tour">
                
                {/* Header Progress */}
                <div className="h-1 w-full bg-slate-800 flex">
                    {TOUR_STEPS.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-full flex-1 transition-all ${idx <= stepIndex ? 'bg-accent-cyan shadow-[0_0_10px_cyan]' : 'bg-transparent'}`}
                        />
                    ))}
                </div>

                <div className="p-8 relative">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        {/* Icon Hexagon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full"></div>
                            <div className="w-16 h-16 relative flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-slate-700" fill="currentColor">
                                    <path d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" />
                                </svg>
                                <div className="relative z-10">{currentStep.icon}</div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-2">
                                Briefing {stepIndex + 1}/{TOUR_STEPS.length}
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                                {currentStep.title}
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                                {currentStep.message}
                            </p>
                        </div>

                        {/* Step 0: Language Selection UI */}
                        {stepIndex === 0 && (
                        <div className="grid grid-cols-2 gap-4 w-full py-2">
                            <button 
                                onClick={() => handleLanguageSelect('de')}
                                className={`
                                    flex flex-col items-center justify-center p-4 rounded-xl border transition-all group
                                    ${language === 'de' 
                                    ? 'bg-accent-cyan/10 border-accent-cyan ring-1 ring-accent-cyan/50' 
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'}
                                `}
                            >
                                <span className="text-2xl mb-2">🇩🇪</span>
                                <span className={`text-xs font-bold font-mono uppercase ${language === 'de' ? 'text-accent-cyan' : 'text-slate-400'}`}>Deutsch</span>
                                {language === 'de' && <Check size={12} className="text-accent-cyan mt-1" />}
                            </button>
                            
                            <button 
                                onClick={() => handleLanguageSelect('en')}
                                className={`
                                    flex flex-col items-center justify-center p-4 rounded-xl border transition-all group
                                    ${language === 'en' 
                                    ? 'bg-accent-cyan/10 border-accent-cyan ring-1 ring-accent-cyan/50' 
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'}
                                `}
                            >
                                <span className="text-2xl mb-2">🇺🇸</span>
                                <span className={`text-xs font-bold font-mono uppercase ${language === 'en' ? 'text-accent-cyan' : 'text-slate-400'}`}>English</span>
                                {language === 'en' && <Check size={12} className="text-accent-cyan mt-1" />}
                            </button>
                        </div>
                        )}

                        {/* Step 1: Age Verification */}
                        {stepIndex === 1 && (
                          <div className="w-full py-2 space-y-4">
                            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4">
                              <div className="flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                                <AlertTriangle size={14} />
                                {language === 'de' ? 'Altersfreigabe: 16+' : 'Age Rating: 16+'}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {language === 'de'
                                  ? 'Inhalte über Verschwörungstheorien, Desinformation und gefährliche Narrative dienen ausschließlich der Medienkompetenz und kritischen Analyse.'
                                  : 'Content about conspiracy theories, disinformation, and dangerous narratives serves media literacy and critical analysis purposes only.'}
                              </p>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-colors">
                              <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)}
                                className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900 checked:bg-amber-500 checked:border-amber-500 accent-amber-500 cursor-pointer" />
                              <span className="text-xs text-slate-300 font-medium">
                                {language === 'de' ? 'Ich bestätige, dass ich mindestens 16 Jahre alt bin.' : 'I confirm that I am at least 16 years old.'}
                              </span>
                            </label>
                          </div>
                        )}

                        {/* Step 2: Privacy Policy Acceptance */}
                        {stepIndex === 2 && (
                          <div className="w-full py-2 space-y-4">
                            <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-4 space-y-2">
                              <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono">
                                <ShieldCheck size={12} /> {language === 'de' ? 'Datenverarbeitung:' : 'Data Processing:'}
                              </div>
                              <ul className="text-[10px] text-slate-400 space-y-1.5 list-none">
                                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> {language === 'de' ? '100% lokal — keine Daten auf Servern gespeichert' : '100% local — no data stored on servers'}</li>
                                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> {language === 'de' ? 'API-Keys mit AES-256-GCM verschlüsselt' : 'API keys encrypted with AES-256-GCM'}</li>
                                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> {language === 'de' ? 'KI-Anfragen gehen direkt an den gewählten Anbieter' : 'AI requests go directly to the chosen provider'}</li>
                                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">⚠</span> {language === 'de' ? 'KI-Antworten sind maschinell generiert — keine Fakten' : 'AI responses are machine-generated — not facts'}</li>
                              </ul>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors">
                              <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900 checked:bg-green-500 checked:border-green-500 accent-green-500 cursor-pointer" />
                              <span className="text-xs text-slate-300 font-medium">
                                {language === 'de' ? 'Ich akzeptiere die Datenschutzerklärung und Nutzungsbedingungen.' : 'I accept the Privacy Policy and Terms of Use.'}
                              </span>
                            </label>
                          </div>
                        )}

                        <div className="flex gap-3 w-full mt-2">
                            {canSkip && (
                            <Button variant="ghost" onClick={handleSkip} className="flex-1 text-xs text-slate-500 hover:text-white uppercase tracking-wider">
                                {t.onboarding.skip}
                            </Button>
                            )}
                            <Button variant="primary" onClick={handleNext} disabled={!canProceed} className={`${canSkip ? 'flex-[2]' : 'flex-1'} shadow-neon-cyan ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`} icon={stepIndex === TOUR_STEPS.length - 1 ? <ShieldCheck size={16}/> : <ArrowRight size={16}/>}>
                                {stepIndex === TOUR_STEPS.length - 1 ? t.onboarding.init : t.onboarding.next}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const TourOverlay: React.FC = () => {
    const { hasSeenOnboarding, isBooting } = useOnboarding();
    
    if (hasSeenOnboarding) return null;
    if (isBooting) return <BootSequence />;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col transition-all duration-500">
            {/* Darken Background */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500"></div>
            <HighlightReticle />
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
