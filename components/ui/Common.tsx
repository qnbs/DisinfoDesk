import React, { useRef, useEffect, forwardRef, useState, useCallback } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchOpen } from '../../store/slices/uiSlice';
import { playSound, haptic } from '../../utils/microInteractions';

// Utility for class merging
// eslint-disable-next-line react-refresh/only-export-components
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
    <header className="relative bg-slate-950/80 border border-white/[0.08] rounded-xl mb-6 shadow-elevation-2 overflow-hidden group shrink-0 select-none backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.15] hover:shadow-elevation-3">
      {/* Visualizer Background */}
      <div className="absolute inset-0 z-0 h-full w-full" aria-hidden="true">
          <HeaderVisualizer state={visualizerState} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
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

interface CardProps extends React.HTMLAttributes<HTMLElement> { variant?: 'glass' | 'cyber' | 'solid' | 'elevated'; as?: React.ElementType; glow?: boolean; }
export const Card = React.memo(forwardRef<HTMLElement, CardProps>(({ children, className = '', onClick, variant = 'glass', glow = false, as: Component = 'div', ...props }, ref) => {
  const soundEnabled = useAppSelector(s => s.settings.config.soundEnabled);
  const variants = {
    glass: "bg-slate-900/50 backdrop-blur-xl border-white/[0.08] hover:border-white/[0.15] hover:shadow-2xl hover:bg-slate-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.04)]",
    cyber: "bg-slate-950/70 backdrop-blur-lg border-slate-800/80 hover:border-accent-cyan/30 hover:shadow-neon-cyan shadow-lg",
    solid: "bg-slate-950 border-slate-800 hover:border-slate-700 shadow-xl",
    elevated: "bg-slate-900/60 backdrop-blur-2xl border-white/[0.08] shadow-elevation-2 hover:shadow-elevation-3 hover:border-white/[0.15] hover:bg-slate-900/70 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLElement>);
      }
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      playSound('click', soundEnabled);
      haptic('light');
      onClick(e);
    }
  }, [onClick, soundEnabled]);

  return (
    <Component 
        ref={ref} 
        className={cn(
            "relative rounded-xl overflow-hidden transition-all duration-300 border group/card", 
            variants[variant], 
            onClick ? "cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none hover-lift" : "", 
            glow ? "animate-glow-pulse" : "",
            className
        )} 
        onClick={onClick ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        {...props}
    >
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />
      {glow && <div className="absolute -inset-px bg-gradient-to-r from-accent-cyan/20 via-purple-500/10 to-accent-cyan/20 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm" />}
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}));
Card.displayName = 'Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'; size?: 'sm' | 'md' | 'lg'; isLoading?: boolean; icon?: React.ReactNode; }
export const Button = React.memo(forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', size = 'md', isLoading = false, icon, className = '', disabled, onClick, ...props }, ref) => {
  const soundEnabled = useAppSelector(s => s.settings.config.soundEnabled);
  const variants = {
    primary: "bg-accent-cyan text-slate-950 hover:bg-cyan-400 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]",
    secondary: "bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-700 hover:text-white shadow-sm backdrop-blur-sm",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
    danger: "bg-danger-red/10 text-danger-red border border-danger-red/50 hover:bg-danger-red hover:text-white hover:border-danger-red shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    accent: "bg-gradient-to-r from-accent-cyan to-purple-500 text-white border border-white/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:brightness-110"
  };
  
  const sizes = { 
      sm: "px-3 py-2 text-[10px] min-h-[44px] gap-1.5", 
      md: "px-4 py-2.5 text-xs min-h-[44px] gap-2", 
      lg: "px-6 py-3 text-sm min-h-[48px] gap-2.5" 
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    playSound(variant === 'danger' ? 'error' : 'click', soundEnabled);
    haptic('light');
    onClick?.(e);
  }, [disabled, isLoading, variant, soundEnabled, onClick]);
  
  return (
    <button 
        ref={ref} 
        className={cn(
            "font-bold font-mono uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation select-none group/btn", 
            variants[variant], 
            sizes[size], 
            className
        )} 
        disabled={disabled || isLoading} 
        aria-busy={isLoading}
        onClick={handleClick}
        {...props}
    >
      {/* Subtle inner shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity" />
      {isLoading && <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin absolute z-20" />}
      <span className={cn("relative z-10 flex items-center justify-center transition-opacity", isLoading ? 'opacity-0' : 'opacity-100', size === 'sm' ? 'gap-1.5' : 'gap-2')}>
        {icon}
        {children}
      </span>
    </button>
  );
}));
Button.displayName = 'Button';

export const Badge: React.FC<{ label: string; color?: string; className?: string; glow?: boolean }> = React.memo(({ label, className = '', glow = false }) => (
    <span className={cn(
      "px-2.5 py-0.5 rounded-md border text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md font-mono whitespace-nowrap bg-slate-900/80 text-slate-300 border-slate-800 shadow-sm transition-colors duration-200",
      glow ? "border-accent-cyan/30 text-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]" : "",
      className
    )}>{label}</span>
));

// Simple EmptyState is superseded by the variant-aware version below

export const Skeleton: React.FC<{ className?: string; variant?: 'text' | 'card' | 'avatar' | 'image' | 'heading' }> = React.memo(({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded w-full',
    card: 'h-32 rounded-xl w-full',
    avatar: 'w-12 h-12 rounded-full shrink-0',
    image: 'aspect-video rounded-lg w-full',
    heading: 'h-6 rounded w-2/3',
  };
  
  return (
    <div 
      className={cn(
        "skeleton shimmer", 
        variants[variant], 
        className
      )} 
      role="status"
      aria-label="Loading..."
      aria-busy="true"
    />
  );
});

/**
 * Skeleton Group - Renders multiple skeleton elements
 */
export const SkeletonGroup: React.FC<{ 
  count?: number; 
  variant?: 'text' | 'card' | 'avatar'; 
  className?: string;
}> = React.memo(({ count = 3, variant = 'text', className = '' }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant={variant} />
    ))}
  </div>
));

export const ErrorFallback: React.FC<{ error: unknown, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-fade-in" role="alert">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full scale-150" />
      <div className="relative bg-red-950/20 p-4 rounded-2xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <Loader2 size={32} className="text-red-500" />
      </div>
    </div>
    <h2 className="text-xl font-bold text-white mb-2 font-display tracking-tight uppercase">System Critical Failure</h2>
    <p className="text-slate-500 text-xs font-mono mb-6 max-w-md leading-relaxed">The application encountered an unrecoverable error. Diagnostic dump: {error instanceof Error ? error.message : String(error)}</p>
    <Button onClick={resetErrorBoundary} variant="secondary">Initiate Reboot Sequence</Button>
  </div>
);

/**
 * Empty State Component
 * Displays engaging cyber-mystic illustration and helpful message
 */
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'default' | 'search' | 'chat' | 'data';
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo((({ 
  icon: Icon, 
  title, 
  description, 
  action,
  variant = 'default'
}) => {
  const variants = {
    default: 'accent-cyan',
    search: 'accent-purple',
    chat: 'success-green',
    data: 'accent-amber',
  };

  const colorClass = variants[variant];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-slate-800/50 glass-panel-subtle text-center animate-fade-in-up">
      <div className="relative mb-6">
        <div className={`absolute inset-0 bg-${colorClass}/10 blur-2xl rounded-full scale-150 opacity-40`} />
        <div className={`relative bg-${colorClass}/5 p-4 rounded-2xl border border-${colorClass}/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]`}>
          <Icon size={40} className={`text-${colorClass}`} />
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-display uppercase tracking-widest">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed font-mono">{description}</p>
      {action && <div className="animate-fade-in-up">{action}</div>}
    </div>
  );
}));

/**
 * Loading Container
 * Wraps content with smooth loading transitions
 */
interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeleton?: React.ReactNode;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = React.memo(({
  isLoading,
  children,
  fallback,
  skeleton,
}) => (
  <div className="relative">
    {isLoading ? (
      <div className="transition-opacity duration-300 opacity-100">
        {fallback || skeleton || <Skeleton variant="card" className="h-40" />}
      </div>
    ) : (
      <div className="transition-opacity duration-300 opacity-100">
        {children}
      </div>
    )}
  </div>
));

/**
 * Cyber-Mystic Divider
 */
export const CyberDivider: React.FC<{ variant?: 'default' | 'dotted' | 'gradient' }> = React.memo(({ 
  variant = 'default' 
}) => {
  const variants = {
    default: 'h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent',
    dotted: 'h-px bg-repeating-linear-gradient(90deg, #475569 0px, #475569 2px, transparent 2px, transparent 8px)',
    gradient: 'h-px bg-gradient-to-r from-accent-cyan/30 via-accent-purple/30 to-accent-cyan/30',
  };

  return <div className={cn(variants[variant])} />;
});

/**
 * Status Badge Component
 */
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'processing' | 'success' | 'error' | 'warning';
  label: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ 
  status, 
  label,
  className
}) => {
  const statusConfig = {
    online: 'bg-green-500/20 text-green-400 border-green-500/40',
    offline: 'bg-red-500/20 text-red-400 border-red-500/40',
    processing: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40',
    success: 'bg-green-500/20 text-green-400 border-green-500/40',
    error: 'bg-red-500/20 text-red-400 border-red-500/40',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border',
      'transition-all duration-200 hover:shadow-lg',
      statusConfig[status],
      className
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'processing' ? 'animate-pulse' : '',
        statusConfig[status].split(' ')[1]
      )} />
      {label}
    </span>
  );
});

/**
 * Ripple Effect Hook
 * Creates click ripple effect for interactive elements
 */
interface Ripple {
  x: number;
  y: number;
  id: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  }, []);

  const RippleContainer = useCallback(() => (
    <>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  ), [ripples]);

  return { addRipple, RippleContainer };
}

/**
 * Advanced Loading Spinner
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'orbit';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  size = 'md',
  variant = 'spinner',
  className = '',
  label,
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  if (variant === 'dots') {
    const dotSizes = {
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
      xl: 'w-3 h-3',
    };
    return (
      <div className={cn('flex items-center gap-1', className)} role="status" aria-label={label || 'Loading'}>
        <span className={cn(dotSizes[size], 'bg-accent-cyan rounded-full animate-[pulse_1.4s_ease-in-out_infinite]')} style={{ animationDelay: '0s' }} />
        <span className={cn(dotSizes[size], 'bg-accent-cyan rounded-full animate-[pulse_1.4s_ease-in-out_infinite]')} style={{ animationDelay: '0.2s' }} />
        <span className={cn(dotSizes[size], 'bg-accent-cyan rounded-full animate-[pulse_1.4s_ease-in-out_infinite]')} style={{ animationDelay: '0.4s' }} />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('relative', className)} role="status" aria-label={label || 'Loading'}>
        <div className={cn('absolute inset-0 bg-accent-cyan rounded-full animate-ping opacity-75')} style={{ width: sizes[size], height: sizes[size] }} />
        <div className={cn('relative bg-accent-cyan rounded-full')} style={{ width: sizes[size], height: sizes[size] }} />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === 'orbit') {
    const orbitSize = sizes[size];
    return (
      <div className={cn('relative', className)} role="status" aria-label={label || 'Loading'} style={{ width: orbitSize, height: orbitSize }}>
        <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  // Default: spinner
  return (
    <div className={cn('flex flex-col items-center gap-2', className)} role="status" aria-label={label || 'Loading'}>
      <Loader2 size={sizes[size]} className="animate-spin text-accent-cyan" />
      {label && <span className="text-xs font-mono text-slate-400 animate-pulse">{label}</span>}
    </div>
  );
});

/**
 * Progress Bar
 */
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'striped';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  label,
  showPercentage = false,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-accent-cyan',
    gradient: 'bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-cyan bg-[length:200%_100%] animate-[borderFlow_3s_linear_infinite]',
    striped: 'bg-accent-cyan bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[borderFlow_1s_linear_infinite]',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-xs font-mono text-slate-400">{label}</span>}
          {showPercentage && <span className="text-xs font-mono font-bold text-accent-cyan">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div 
        className={cn('w-full bg-slate-800/50 rounded-full overflow-hidden', sizes[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

/**
 * Tooltip Component
 */
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = React.memo(({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-mono text-white bg-slate-900 border border-slate-700 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fade-in-scale',
            positions[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div 
            className="absolute w-2 h-2 bg-slate-900 border-slate-700 transform rotate-45"
            style={{
              ...(position === 'top' && { bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: '1px solid #334155', borderBottom: '1px solid #334155' }),
              ...(position === 'bottom' && { top: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderLeft: '1px solid #334155', borderTop: '1px solid #334155' }),
              ...(position === 'left' && { right: -5, top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderTop: '1px solid #334155', borderRight: '1px solid #334155' }),
              ...(position === 'right' && { left: -5, top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderBottom: '1px solid #334155', borderLeft: '1px solid #334155' }),
            }}
          />
        </div>
      )}
    </div>
  );
});

/**
 * Collapsible/Accordion Component
 */
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = React.memo(({
  title,
  children,
  defaultOpen = false,
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-slate-800 rounded-lg overflow-hidden transition-all', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-900/50 hover:bg-slate-900/70 transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-mono text-sm font-bold text-slate-200">{title}</span>
        </div>
        <svg
          className={cn('w-5 h-5 text-slate-400 transition-transform duration-300', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 bg-slate-950/30">
          {children}
        </div>
      </div>
    </div>
  );
});

/**
 * Animated Counter
 */
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(({
  value,
  duration = 1000,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const displayRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayRef.current;
    const diff = value - startValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + diff * easeOutQuart;
      const rounded = Math.round(current);

      displayRef.current = rounded;
      setDisplayValue(rounded);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={cn('font-mono font-bold', className)}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
});

// --- AI Disclaimer Banner ---

export const AIDisclaimer: React.FC<{ language?: 'de' | 'en'; className?: string; compact?: boolean }> = React.memo(({ language = 'de', className = '', compact = false }) => (
  <div className={`flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-950/10 ${compact ? 'px-3 py-2' : 'px-4 py-3'} ${className}`} role="note" aria-label={language === 'de' ? 'KI-Hinweis' : 'AI Disclaimer'}>
    <svg className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <p className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-amber-400/80 leading-relaxed font-mono`}>
      {language === 'de'
        ? 'KI-generiert — Nur für Bildungszwecke. Keine medizinische, rechtliche oder faktische Beratung. Immer eigenständig verifizieren.'
        : 'AI-generated — Educational purposes only. Not medical, legal, or factual advice. Always verify independently.'}
    </p>
  </div>
));