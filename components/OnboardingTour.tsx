
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { completeOnboarding } from '../store/slices/settingsSlice';
import { Button, Card } from './ui/Common';
import { Terminal, ArrowRight, ShieldCheck, Search, MessageSquare, LayoutDashboard } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  highlightId?: string; // ID of the DOM element to highlight
}

const TOUR_STEPS: Step[] = [
  {
    id: 0,
    title: "AGENT ORIENTATION",
    message: "Identity Confirmed. Welcome to DisinfoDesk, your central command for analyzing and deconstructing modern information warfare.",
    icon: <Terminal size={32} className="text-accent-cyan" />,
  },
  {
    id: 1,
    title: "MODULE NAVIGATION",
    message: "Access the Archive, Threat Matrix, and Viral Simulators from the secure sidebar. Your toolkit lies here.",
    icon: <LayoutDashboard size={32} className="text-accent-purple" />,
    highlightId: "nav-sidebar"
  },
  {
    id: 2,
    title: "GLOBAL INTEL",
    message: "Use OmniSearch (CMD+K) to instantly query the entire database of theories, authors, and media artifacts.",
    icon: <Search size={32} className="text-accent-cyan" />,
    highlightId: "nav-search"
  },
  {
    id: 3,
    title: "AI UPLINK",
    message: "Dr. Veritas is standing by. Use the Chat module for real-time fact-checking and logic analysis.",
    icon: <MessageSquare size={32} className="text-green-400" />,
    highlightId: "nav-chat"
  }
];

export const OnboardingTour: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasSeenOnboarding = useAppSelector(state => state.settings.config.hasSeenOnboarding);
  const [stepIndex, setStepIndex] = useState(0);
  const [coords, setCoords] = useState<{top: number, left: number, width: number, height: number} | null>(null);

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
  }, [stepIndex, currentStep.highlightId, hasSeenOnboarding]);

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

  if (hasSeenOnboarding) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col transition-all duration-500">
      
      {/* Background Dimmer with Cutout logic */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500">
        {/* If we have coords, we could try to use clip-path, but simpler is just a Spotlight visual near the element */}
      </div>

      {/* Spotlight Highlight Box */}
      {coords && (
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
      )}

      {/* Main Content Card - Centered or Positioned near highlight? Centered is safer for responsive */}
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

                <div className="flex gap-2 mt-4 w-full">
                    <Button variant="ghost" onClick={handleSkip} className="flex-1 text-xs text-slate-500 hover:text-white">
                        SKIP BRIEFING
                    </Button>
                    <Button variant="primary" onClick={handleNext} className="flex-[2]" icon={stepIndex === TOUR_STEPS.length - 1 ? <ShieldCheck size={16}/> : <ArrowRight size={16}/>}>
                        {stepIndex === TOUR_STEPS.length - 1 ? "INITIALIZE" : "NEXT"}
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
    </div>
  );
};
