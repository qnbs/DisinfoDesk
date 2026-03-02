import React, { useRef, useEffect, forwardRef, useState } from 'react';
import { Loader2, Search, Terminal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchOpen } from '../../store/slices/uiSlice';

// Utility for class merging
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface VisualizerProps {
  state?: 'IDLE' | 'BUSY' | 'ALERT' | 'LISTENING';
}

// --- Visualizer Component (High Performance) ---
const HeaderVisualizer: React.FC<VisualizerProps> = React.memo(({ state = 'IDLE' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);
    const reducedMotion = useAppSelector(state => state.settings.config.reducedMotion);
    const [isVisible, setIsVisible] = useState(false); // Default off until observed

    // 1. Performance: Intersection Observer to pause rendering when off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.01 } // Trigger as soon as 1% is visible
        );
        
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Immediate bailout: Reduced motion, Idle state, or Off-screen
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

        if (state === 'IDLE' || reducedMotion || !isVisible) {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = 0;
            }
            return;
        }

        if (!ctx) return;

        let t = 0;
        const dpr = window.devicePixelRatio || 1;
        let width = 0;
        let height = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                if (width !== rect.width || height !== rect.height) {
                    width = rect.width;
                    height = rect.height;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    ctx.scale(dpr, dpr);
                }
            }
        };

        const render = () => {
            if (!canvas || !ctx) return;
            
            t += state === 'BUSY' ? 0.1 : 0.05;
            
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1.5;
            const centerY = height / 2;

            let baseColorRgb = '6, 182, 212'; // Cyan
            let amplitude = 10;
            
            if (state === 'BUSY') { 
                baseColorRgb = '139, 92, 246'; // Purple
                amplitude = 25; 
            } else if (state === 'ALERT') { 
                baseColorRgb = '239, 68, 68'; // Red
                amplitude = 15; 
            } else if (state === 'LISTENING') { 
                baseColorRgb = '239, 68, 68'; 
                amplitude = 20 + Math.sin(t * 10) * 10; 
            }

            // Draw 3 overlapping sine waves with varied opacity
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${baseColorRgb}, ${0.2 + i * 0.15})`;
                for (let x = 0; x < width; x += 5) { 
                    const y = centerY + Math.sin(x * 0.02 + (t * 1.5) + i) * amplitude * Math.sin(t * 0.2);
                    if (x === 0) ctx.moveTo(x, y); 
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            frameRef.current = requestAnimationFrame(render);
        };

        resize();
        window.addEventListener('resize', resize, { passive: true });
        render();

        return () => {
            window.removeEventListener('resize', resize);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [state, reducedMotion, isVisible]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <canvas 
                ref={canvasRef} 
                className="w-full h-full object-cover opacity-80 mix-blend-screen"
                style={{ willChange: isVisible && state !== 'IDLE' ? 'contents' : 'auto' }}
            />
        </div>
    );
});

// --- UI Components ---

interface PageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export const PageFrame = React.memo(forwardRef<HTMLDivElement, PageFrameProps>(({ children, className = '', as: Component = 'div', ...props }, ref) => (
    <Component ref={ref} className={cn("relative min-h-full w-full", className)} {...props}>
      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto pb-safe-bottom md:pb-24 animate-fade-in-up">
        {children}
      </div>
    </Component>
)));
PageFrame.displayName = 'PageFrame';

export const TechIconBox: React.FC<{ icon: React.ElementType, className?: string, color?: string }> = React.memo(({ icon: Icon, className = "w-12 h-12", color = "text-accent-cyan" }) => (
  <div className={cn("relative rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800 shadow-inner group overflow-hidden shrink-0", className)}>
    <div className="absolute inset-0 opacity-20 bg-accent-cyan/10 group-hover:opacity-40 transition-opacity" />
    <Icon size={className.includes('12') ? 20 : 24} className={cn("relative z-10 transition-transform duration-300 group-hover:scale-110", color)} />
  </div>
));

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

export const PageHeader: React.FC<PageHeaderProps> = React.memo(({ title, subtitle, icon: Icon, actions, children, status = "ONLINE", statusColor = "bg-green-500", visualizerState = "IDLE" }) => {
  const dispatch = useAppDispatch();
  return (
    <header className="relative bg-slate-950/80 border border-white/10 rounded-xl mb-6 shadow-2xl overflow-hidden group shrink-0 select-none backdrop-blur-xl transition-all duration-500 hover:border-white/20">
      {/* Visualizer Background */}
      <div className="absolute inset-0 z-0 h-full w-full" aria-hidden="true">
          <HeaderVisualizer state={visualizerState} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <div className="relative z-10 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
              <TechIconBox icon={Icon} className="w-12 h-12 hidden sm:flex" />
              <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2 md:gap-3">
                      <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-none uppercase truncate max-w-full">{title}</h1>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", statusColor.replace('bg-', 'text-').replace('text-', 'bg-'))} />
                        <span className={cn("text-[9px] font-mono font-bold tracking-[0.1em] uppercase opacity-90", statusColor.replace('bg-', 'text-'))}>{status}</span>
                      </div>
                  </div>
                  {subtitle && <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mt-1 truncate block">{subtitle}</span>}
              </div>
          </div>
          
          {/* Actions - Flex Wrap for Mobile */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
             <button 
                onClick={() => dispatch(setSearchOpen(true))} 
                aria-label="Open command terminal"
                className="group relative flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-accent-cyan/50 rounded-lg transition-all hover:shadow-neon-cyan active:scale-95 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
             >
                <Terminal size={18} className="text-slate-400 group-hover:text-accent-cyan transition-colors" />
             </button>
             <div className="flex flex-wrap gap-2">
                {actions}
             </div>
          </div>
      </div>
      {children && <div className="pb-5 pt-1 relative z-10 animate-fade-in px-5 md:pl-[80px] md:pr-5 border-t border-white/5 mt-2">{children}</div>}
    </header>
  );
});

interface CardProps extends React.HTMLAttributes<HTMLElement> { variant?: 'glass' | 'cyber' | 'solid'; as?: React.ElementType; }
export const Card = React.memo(forwardRef<HTMLElement, CardProps>(({ children, className = '', onClick, variant = 'glass', as: Component = 'div', ...props }, ref) => {
  const variants = {
    glass: "bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-white/20 hover:shadow-2xl hover:bg-slate-900/70",
    cyber: "bg-slate-950/80 backdrop-blur-md border-slate-800 hover:border-accent-cyan/30 hover:shadow-neon-cyan shadow-lg",
    solid: "bg-slate-950 border-slate-800 hover:border-slate-700 shadow-xl"
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLElement>);
      }
  };

  return (
    <Component 
        ref={ref} 
        className={cn(
            "relative rounded-xl overflow-hidden transition-all duration-300 border", 
            variants[variant], 
            onClick ? "cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none" : "", 
            className
        )} 
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        {...props}
    >
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}));
Card.displayName = 'Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; isLoading?: boolean; icon?: React.ReactNode; }
export const Button = React.memo(forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', size = 'md', isLoading = false, icon, className = '', disabled, ...props }, ref) => {
  const variants = {
    primary: "bg-accent-cyan text-slate-950 hover:bg-cyan-400 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
    secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-700 hover:text-white shadow-sm",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
    danger: "bg-danger-red/10 text-danger-red border border-danger-red/50 hover:bg-danger-red hover:text-white hover:border-danger-red shadow-[0_0_10px_rgba(239,68,68,0.1)]"
  };
  
  const sizes = { 
      sm: "px-3 py-2 text-[10px] min-h-[36px] gap-1.5", 
      md: "px-4 py-2.5 text-xs min-h-[44px] gap-2", 
      lg: "px-6 py-3 text-sm min-h-[48px] gap-2.5" 
  };
  
  return (
    <button 
        ref={ref} 
        className={cn(
            "font-bold font-mono uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation select-none", 
            variants[variant], 
            sizes[size], 
            className
        )} 
        disabled={disabled || isLoading} 
        aria-busy={isLoading}
        {...props}
    >
      {isLoading && <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin absolute" />}
      <span className={cn("relative z-10 flex items-center justify-center transition-opacity", isLoading ? 'opacity-0' : 'opacity-100', size === 'sm' ? 'gap-1.5' : 'gap-2')}>
        {icon}
        {children}
      </span>
    </button>
  );
}));
Button.displayName = 'Button';

export const Badge: React.FC<{ label: string; color?: string; className?: string }> = React.memo(({ label, className = '' }) => (
    <span className={cn("px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider backdrop-blur-md font-mono whitespace-nowrap bg-slate-900 text-slate-400 border-slate-800 shadow-sm", className)}>{label}</span>
));

export const EmptyState: React.FC<{ icon?: React.ElementType; title: string; description: string; action?: React.ReactNode; className?: string }> = React.memo(({ icon: Icon = Search, title, description, action, className = "" }) => (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in", className)}>
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-accent-cyan/10 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
        <div className="relative p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"><Icon size={32} className="text-slate-500 group-hover:text-accent-cyan transition-colors" /></div>
      </div>
      <h3 className="text-base font-bold text-white mb-2 font-display uppercase tracking-widest">{title}</h3>
      <p className="text-slate-500 text-xs max-w-sm mb-8 leading-relaxed font-mono">{description}</p>
      {action && <div className="animate-fade-in delay-100">{action}</div>}
    </div>
));

export const Skeleton: React.FC<{ className?: string; variant?: 'text' | 'card' | 'avatar' | 'image' }> = React.memo(({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-xl',
    avatar: 'w-12 h-12 rounded-full',
    image: 'aspect-video rounded-lg',
  };
  
  return (
    <div 
      className={cn("shimmer-loading", variants[variant], className)} 
      role="status"
      aria-label="Loading..."
    />
  );
});

export const ErrorFallback: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center" role="alert">
    <div className="bg-red-950/20 p-4 rounded-full mb-6 border border-red-500/20 shadow-neon-red"><Loader2 size={32} className="text-red-500" /></div>
    <h2 className="text-xl font-bold text-white mb-2 font-display tracking-tight uppercase">System Critical Failure</h2>
    <p className="text-slate-500 text-xs font-mono mb-6 max-w-md">The application encountered an unrecoverable error. Diagnostic dump: {error.message}</p>
    <Button onClick={resetErrorBoundary} variant="secondary">Initiate Reboot Sequence</Button>
  </div>
);