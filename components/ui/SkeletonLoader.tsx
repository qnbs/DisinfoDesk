import React from 'react';
import { cn } from './Common';

/**
 * Skeleton Loaders - Animated placeholders for loading states
 * Respects prefers-reduced-motion accessibility setting
 */

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-slate-800 rounded animate-pulse',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
        style={{
          animationDelay: `${i * 100}ms`,
        }}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-lg border border-slate-800 p-4 glass-panel-subtle', className)}>
    <div className="h-6 bg-slate-800 rounded w-1/3 mb-4 animate-pulse" />
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md',
  className 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return (
    <div
      className={cn(
        sizes[size],
        'rounded-full bg-slate-800 animate-pulse',
        className
      )}
    />
  );
};

export const SkeletonChatMessage: React.FC<{ isUser?: boolean; className?: string }> = ({ 
  isUser = false,
  className
}) => (
  <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start', className)}>
    {!isUser && <SkeletonAvatar size="sm" />}
    <div className={cn('space-y-2 flex-1', isUser ? 'max-w-xs place-self-end' : 'max-w-md')}>
      <div className="h-4 bg-slate-800 rounded animate-pulse" />
      <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
      <div className="h-3 bg-slate-800 rounded animate-pulse w-2/3" />
    </div>
    {isUser && <SkeletonAvatar size="sm" />}
  </div>
);

export const SkeletonMatrix: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ 
  rows = 4,
  cols = 3,
  className
}) => (
  <div className={cn('grid gap-3', className)} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {Array.from({ length: rows * cols }).map((_, i) => (
      <div
        key={i}
        className="rounded-lg border border-slate-800 p-4 glass-panel-subtle animate-pulse h-32"
        style={{
          animationDelay: `${(i % cols) * 100}ms`,
        }}
      />
    ))}
  </div>
);

export const SkeletonTheoryList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 5,
  className
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex gap-4 p-3 rounded-lg border border-slate-800 glass-panel-subtle animate-pulse"
        style={{
          animationDelay: `${i * 50}ms`,
        }}
      >
        <div className="w-12 h-12 rounded bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonBarChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-20 h-3 bg-slate-800 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
        <div 
          className="h-6 bg-gradient-to-r from-accent-cyan/30 to-accent-cyan/10 rounded animate-pulse"
          style={{
            width: `${30 + Math.random() * 50}%`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      </div>
    ))}
  </div>
);

export const SkeletonNetworkGraph: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('relative', className)}>
    <svg className="w-full h-full" viewBox="0 0 300 300" style={{ minHeight: '300px' }}>
      {/* Skeleton nodes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = 150 + Math.cos(angle) * 80;
        const y = 150 + Math.sin(angle) * 80;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="12"
            fill="#334155"
            className="animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        );
      })}
      {/* Skeleton lines */}
      {Array.from({ length: 3 }).map((_, i) => (
        <line
          key={`line-${i}`}
          x1="150"
          y1="150"
          x2={150 + Math.cos((i / 3) * Math.PI * 2) * 80}
          y2={150 + Math.sin((i / 3) * Math.PI * 2) * 80}
          stroke="#475569"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDelay: `${i * 75}ms` }}
        />
      ))}
    </svg>
  </div>
);
