
import React, { useState, useEffect } from 'react';
import {
  Cpu, Activity, Wifi, Zap, Image as ImageIcon
} from 'lucide-react';

export type HUDMode = 'ANALYSIS' | 'IMAGE' | 'CREATIVE' | 'STREAM';

interface GenerationHUDProps {
  mode: HUDMode;
  isVisible: boolean;
  className?: string;
  variant?: 'card' | 'overlay';
}

const LOG_TEMPLATES = {
  ANALYSIS: [
    "Initializing Gemini 2.5 Pro Context Window...",
    "Tokenizing input vectors [Batch size: 1]...",
    "Retrieving Grounding Metadata from Google Search...",
    "Cross-referencing historical archives...",
    "Aligning safety filters (HarmBlockThreshold: BLOCK_ONLY_HIGH)...",
    "Synthesizing scientific consensus...",
    "Decoding semantic layers...",
    "Formatting JSON output stream...",
    "Finalizing structural integrity..."
  ],
  IMAGE: [
    "Allocating GPU buffers for diffusion model...",
    "Parsing prompt semantics...",
    "Generating noise seed [Randomization]...",
    "Resolving geometry and composition...",
    "Applying style transfer: Cinematic/Dark...",
    "Denoising steps [Iterations: 0-20]...",
    "Denoising steps [Iterations: 20-40]...",
    "Upscaling raster to high-res...",
    "Optimizing color grading..."
  ],
  CREATIVE: [
    "Loading Satire Archetypes...",
    "Injecting 'Paranoia' parameters...",
    "Calculating narrative plausibility...",
    "Drafting abstract logic chains...",
    "Applying humor heuristics...",
    "Encrypting punchlines...",
    "Reviewing for maximum absurdity...",
    "Compiling narrative arc..."
  ],
  STREAM: [
    "Opening secure socket layer...",
    "Handshaking with Dr. Veritas Node...",
    "Streaming tokens...",
    "Verifying logic gates...",
    "Buffer flush..."
  ]
};

export const GenerationHUD: React.FC<GenerationHUDProps> = ({ mode, isVisible, className = '', variant = 'card' }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({ tps: 0, latency: 0, conf: 0 });
  
  // Reset when visibility changes
  useEffect(() => {
    if (isVisible) {
      setLogs([]);
      setProgress(0);
      setMetrics({ tps: 0, latency: 12, conf: 0.85 });
    }
  }, [isVisible]);

  // Simulation Logic
  useEffect(() => {
    if (!isVisible) return;

    const templates = LOG_TEMPLATES[mode];
    let step = 0;
    
    // Log Timer
    const logInterval = setInterval(() => {
      if (step < templates.length) {
        setLogs(prev => [...prev.slice(-4), `> ${templates[step]}`]); // Keep last 5
        step++;
      }
    }, 800); // New log every 800ms

    // Progress & Metrics Timer
    const metricInterval = setInterval(() => {
      setProgress(old => {
        // Asymptotic approach to 95%
        const diff = 95 - old;
        return old + (diff * 0.05);
      });

      setMetrics(prev => ({
        tps: Math.floor(Math.random() * 50) + 120, // 120-170 tokens/sec
        latency: prev.latency + (Math.random() * 2),
        conf: Math.min(0.99, prev.conf + 0.005)
      }));
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(metricInterval);
    };
  }, [isVisible, mode]);

  if (!isVisible) return null;

  const Icon = mode === 'IMAGE' ? ImageIcon : mode === 'CREATIVE' ? Zap : Cpu;
  const colorClass = mode === 'IMAGE' ? 'text-purple-400' : mode === 'CREATIVE' ? 'text-yellow-400' : 'text-accent-cyan';
  const borderClass = mode === 'IMAGE' ? 'border-purple-500/30' : mode === 'CREATIVE' ? 'border-yellow-500/30' : 'border-accent-cyan/30';
  const bgClass = mode === 'IMAGE' ? 'bg-purple-500' : mode === 'CREATIVE' ? 'bg-yellow-500' : 'bg-accent-cyan';

  // --- OVERLAY VARIANT (Optimized for Image Generation) ---
  if (variant === 'overlay') {
    return (
        <div className={`absolute inset-0 bg-slate-950/60 backdrop-blur-xl flex flex-col items-center justify-center z-50 ${className}`} role="status" aria-live="assertive" aria-label="AI generation in progress">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            
            {/* Central Loader */}
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <Icon size={32} className={`${colorClass} animate-pulse`} />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-3xl font-black text-white tracking-tighter">{Math.floor(progress)}%</span>
                </div>
            </div>

            {/* Status Text */}
            <div className="text-sm font-bold text-white uppercase tracking-widest mb-2 animate-pulse">
                Rendering Visualization
            </div>

            {/* Single Line Log Terminal */}
            <div className="h-6 overflow-hidden max-w-md w-full text-center px-4">
                <span className="font-mono text-[10px] text-slate-400">
                    {logs.length > 0 ? logs[logs.length - 1] : "Initializing..."}
                </span>
            </div>

            {/* Corner Stats */}
            <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 text-right">
                <div className="flex items-center justify-end gap-1">
                    LATENCY <span className="text-white">{metrics.latency.toFixed(0)}ms</span>
                </div>
                <div className="flex items-center justify-end gap-1">
                    CONFIDENCE <span className="text-white">{(metrics.conf * 100).toFixed(1)}%</span>
                </div>
            </div>

            {/* Decorative Scanlines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent h-[10%] w-full animate-scan pointer-events-none"></div>
        </div>
    );
  }

  // --- CARD VARIANT (Standard) ---
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-950/70 backdrop-blur-xl border ${borderClass} shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col ${className}`} role="status" aria-label="AI generation in progress">
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[20%] animate-scan pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Icon size={20} className={`${colorClass} animate-pulse`} />
             <div className={`absolute inset-0 ${colorClass} blur-md opacity-50`}></div>
          </div>
          <div>
            <div className={`text-xs font-bold font-mono uppercase tracking-widest ${colorClass}`}>
              AI PROCESS: {mode}
            </div>
            <div className="text-[9px] text-slate-500 font-mono">
              GEMINI-2.5-PRO // LIVE PROCESSING
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Activity size={14} className="text-slate-600 animate-bounce" />
           <Wifi size={14} className="text-slate-600" />
        </div>
      </div>

      {/* Main Display */}
      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Left: Metrics Visualization */}
        <div className="w-full md:w-1/3 space-y-4">
           {/* Progress Circle */}
           <div className="relative h-24 w-full bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <Cpu size={64} className={colorClass} />
              </div>
              <div className="text-center z-10">
                 <div className="text-3xl font-black font-mono text-white">{Math.floor(progress)}%</div>
                 <div className="text-[9px] text-slate-400 uppercase tracking-widest">Completion</div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 ${bgClass}`} style={{ width: `${progress}%` }}></div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                 <span className="text-slate-500 block">TOKENS/S</span>
                 <span className="text-white font-bold">{metrics.tps}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                 <span className="text-slate-500 block">LATENCY</span>
                 <span className="text-white font-bold">{metrics.latency.toFixed(0)}ms</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 col-span-2">
                 <span className="text-slate-500 block">CONFIDENCE INTERVAL</span>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full ${bgClass}`} style={{ width: `${metrics.conf * 100}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Terminal Log */}
        <div className="flex-1 bg-black/50 rounded-lg border border-slate-800 p-4 font-mono text-xs overflow-hidden relative" role="log" aria-live="polite" aria-label="AI processing log">
           <div className="absolute top-2 right-2 text-[9px] text-slate-600" aria-hidden="true">SYS_LOG.TXT</div>
           <div className="space-y-1.5 mt-2">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${i === logs.length - 1 ? 'text-white font-bold' : 'text-slate-400 opacity-70'}`}>
                   <span className="text-slate-600">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                   <span className="break-all">{log}</span>
                </div>
              ))}
              <div className={`h-3 w-2 ${bgClass} animate-pulse mt-1`}></div>
           </div>
        </div>

      </div>
    </div>
  );
};
