
import React, { useRef, useEffect } from 'react';
import { Loader2, SearchX } from 'lucide-react';

// --- Visualizer Engine ---

interface VisualizerProps {
  state?: 'IDLE' | 'BUSY' | 'ALERT' | 'LISTENING';
}

const HeaderVisualizer: React.FC<VisualizerProps> = ({ state = 'IDLE' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        // High DPI Scaling
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                const rect = parent.getBoundingClientRect();
                
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                
                // Scale CSS to match
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                
                ctx.scale(dpr, dpr);
            }
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            t += 0.05;
            
            // Physical dimensions for drawing logic
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            // Clear with fade effect for trail
            ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'; // Matching slate-900 with some trail
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 2;
            const centerY = height / 2;

            // Configuration based on state
            let baseColor = '6, 182, 212'; // Cyan (IDLE)
            let amplitude = 10;
            let frequency = 0.02;
            let speed = 1;

            if (state === 'BUSY') {
                baseColor = '139, 92, 246'; // Purple
                amplitude = 25;
                frequency = 0.05;
                speed = 2;
            } else if (state === 'ALERT') {
                baseColor = '239, 68, 68'; // Red
                amplitude = 15;
                frequency = 0.03;
                speed = 1.5;
            } else if (state === 'LISTENING') {
                baseColor = '239, 68, 68'; // Red
                amplitude = 20 + Math.sin(t * 10) * 10;
                frequency = 0.1;
                speed = 3;
            }

            // Draw multiple waves
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${baseColor}, ${0.3 + i * 0.15})`;
                
                for (let x = 0; x < width; x++) {
                    const y = centerY + 
                        Math.sin(x * frequency + (t * speed) + i) * amplitude * Math.sin(t * 0.2) +
                        Math.cos(x * 0.01 - t) * (amplitude * 0.3);
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [state]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
        />
    );
};

// --- Page Wrapper (Unified Design) ---
interface PageFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PageFrame: React.FC<PageFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-full w-full ${className}`}>
      {/* Content Container - Optimized padding for Mobile (p-4) vs Desktop (p-8) */}
      <div className="relative z-10 p-4 md:p-8 max-w-[1800px] mx-auto pb-safe-bottom md:pb-12 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

// --- Tech Icon Box (Shared between Header & Sidebar) ---
export const TechIconBox: React.FC<{ icon: React.ElementType, className?: string, color?: string }> = ({ icon: Icon, className = "w-16 h-16", color = "text-accent-cyan" }) => (
  <div className={`
    relative rounded-xl flex items-center justify-center 
    bg-slate-950 border border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.1)]
    overflow-hidden group hover:border-accent-cyan/50 transition-all duration-500 shrink-0
    ${className}
  `}>
    {/* Background Grid/Noise */}
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    
    {/* Scanline */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent translate-y-[-100%] group-hover:animate-scan pointer-events-none"></div>
    
    {/* Icon */}
    <Icon size={className.includes('12') ? 24 : 32} className={`relative z-10 ${color} group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]`} />
    
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-accent-cyan transition-colors"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-accent-cyan transition-colors"></div>
  </div>
);

// --- Page Header (Unified Design) ---
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  status?: string;
  statusColor?: string;
  visualizerState?: 'IDLE' | 'BUSY' | 'ALERT' | 'LISTENING';
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  children,
  status = "SYSTEM ONLINE",
  statusColor = "bg-green-500",
  visualizerState = "IDLE"
}) => {
  return (
    <div className="relative bg-slate-900 border-b border-slate-800 -mx-4 md:-mx-8 px-4 md:px-8 py-0 mb-6 md:mb-8 shadow-2xl overflow-hidden group shrink-0 select-none">
      
      {/* Background Visualizer */}
      <div className="absolute inset-0 z-0 h-full bg-slate-950">
          <HeaderVisualizer state={visualizerState} />
          {/* Tech Overlays */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/95"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950/50"></div>
      </div>

      <div className="relative z-10 py-6 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          {/* Title Section - THE EXACT DR. VERITAS LAYOUT */}
          <div className="flex items-center gap-4 md:gap-6">
              <TechIconBox icon={Icon} className="w-12 h-12 md:w-16 md:h-16" />
              
              <div className="flex flex-col">
                  {/* Main Title Row */}
                  <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-2xl flex flex-col md:flex-row md:items-end gap-2 font-sans">
                      {title}
                      <span className="text-[10px] md:text-xs font-mono font-normal text-accent-cyan/80 bg-slate-950/80 border border-accent-cyan/30 px-2 py-0.5 rounded tracking-widest mb-1.5 shadow-[0_0_10px_rgba(6,182,212,0.1)] w-fit hidden sm:inline-block">
                        v2.6
                      </span>
                  </h1>
                  
                  {/* Status Row */}
                  <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800/50 backdrop-blur-sm">
                        <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${statusColor.replace('bg-', 'text-').replace('text-', 'bg-')}`}></span>
                        <span className={`text-[9px] font-mono font-bold tracking-[0.25em] uppercase ${statusColor.replace('bg-', 'text-')}`}>
                            {status}
                        </span>
                      </div>
                      
                      {subtitle && (
                        <div className="hidden sm:flex items-center gap-3 text-slate-500">
                            <span className="opacity-50">//</span>
                            <span className="text-[10px] font-mono uppercase tracking-widest font-medium opacity-80">{subtitle}</span>
                        </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Actions/Controls */}
          {actions && <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 justify-end">{actions}</div>}
      </div>

      {/* Decorative Bottom Line with Scan Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-800">
         <div className="absolute top-0 left-0 h-full w-full bg-accent-cyan/50 blur-[2px] animate-scan opacity-50"></div>
      </div>

      {/* Optional Children (Search bars, filters) - styled as a sub-panel */}
      {children && (
        <div className="pb-6 pt-0 relative z-10 animate-fade-in pl-0 md:pl-[88px]">
           {children}
        </div>
      )}
    </div>
  );
};

// --- Card Component (Glass Panel) ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  const baseClasses = "bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden";
  const hoverClasses = hoverEffect || onClick 
    ? "transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:bg-slate-900/80 active:scale-[0.99]" 
    : "";
  const cursorClass = onClick ? "cursor-pointer" : "";

  // Accessibility handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const interactiveProps = onClick ? {
    role: 'button',
    tabIndex: 0,
    onKeyDown: handleKeyDown,
  } : {};

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
      {...interactiveProps}
    >
      {children}
    </div>
  );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = "font-bold rounded-lg transition-all flex items-center justify-center focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:translate-y-[1px] touch-manipulation font-mono uppercase tracking-wide relative overflow-hidden";
  
  const variants = {
    primary: "bg-accent-cyan text-slate-900 hover:bg-cyan-400 focus:ring-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-transparent hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    secondary: "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-slate-500 focus:ring-slate-500 backdrop-blur-sm",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500 border border-transparent hover:border-slate-700",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 focus:ring-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-3 text-xs md:text-sm",
    lg: "px-8 py-4 text-sm md:text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin absolute" /> : icon && <span className="mr-2">{icon}</span>}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
};

// --- Badge Component ---
interface BadgeProps {
  label: string;
  color?: 'default' | 'cyan' | 'purple' | 'green' | 'red' | 'yellow' | 'orange';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = React.memo(({ label, color = 'default', className = '' }) => {
  const colors = {
    default: "bg-slate-800 text-slate-400 border-slate-700",
    cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
    green: "bg-green-500/10 text-green-400 border-green-500/30",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  };

  return (
    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded border text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md ${colors[color]} ${className}`}>
      {label}
    </span>
  );
});

// --- Empty State Component ---
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = SearchX, 
  title, 
  description, 
  action,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in ${className}`}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full opacity-20"></div>
        <div className="relative p-6 bg-slate-900/50 border border-slate-800 rounded-full shadow-2xl backdrop-blur-sm">
          <Icon size={48} className="text-slate-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 text-accent-cyan animate-bounce">
           <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-widest">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">{description}</p>
      
      {action && (
        <div className="animate-fade-in delay-100">
          {action}
        </div>
      )}
    </div>
  );
};

// --- Loading Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-800/50 animate-pulse rounded ${className}`}></div>
);

// --- Full Page Error Fallback ---
export const ErrorFallback: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center" role="alert">
    <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
      <Loader2 size={32} className="text-red-500" />
    </div>
    <h2 className="text-xl font-bold text-white mb-2 font-mono tracking-tight">System Critical Failure</h2>
    <p className="text-slate-400 mb-6 max-w-md text-sm">The truth matrix has encountered an unrecoverable anomaly.</p>
    <pre className="bg-black/50 border border-slate-800 p-4 rounded text-[10px] text-red-400 mb-6 max-w-sm overflow-x-auto font-mono">{error.message}</pre>
    <Button onClick={resetErrorBoundary} variant="secondary">Initiate Reboot</Button>
  </div>
);
