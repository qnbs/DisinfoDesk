/**
 * Micro-Interactions System
 * Provides consistent styling classes and utilities for interactive elements
 * Includes hover, focus, tap, and scale effects with reduced-motion awareness
 */

export const microInteractions = {
  // Button micro-interactions
  button: {
    primary: `
      transition-all duration-200 ease-out
      hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]
      hover:translate-y-[-2px]
      active:translate-y-[0px]
      active:scale-95
      focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0
    `,
    secondary: `
      transition-all duration-200 ease-out
      hover:bg-slate-700
      active:scale-95
      focus-visible:ring-2 focus-visible:ring-accent-cyan
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    subtle: `
      transition-all duration-150 ease-out
      hover:bg-slate-900/50
      hover:text-accent-cyan
      active:scale-90
      focus-visible:ring-2 focus-visible:ring-accent-cyan
    `,
  },

  // Card micro-interactions
  card: {
    default: `
      transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
      hover:shadow-[0_8px_32px_rgba(6,182,212,0.1)]
      hover:border-accent-cyan/50
      hover:translate-y-[-4px]
      focus-within:ring-2 focus-within:ring-accent-cyan
    `,
    interactive: `
      transition-all duration-300 ease-out
      hover:shadow-[0_12px_48px_rgba(6,182,212,0.15)]
      hover:border-accent-cyan/70
      hover:translate-y-[-6px]
      cursor-pointer
      active:scale-[0.98]
    `,
  },

  // Input micro-interactions
  input: `
    transition-all duration-200 ease-out
    focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-[#020617]
    hover:border-accent-cyan/50
    active:ring-accent-cyan
  `,

  // Link micro-interactions
  link: `
    transition-colors duration-200 ease-out
    hover:text-accent-cyan
    hover:underline
    focus-visible:ring-2 focus-visible:ring-accent-cyan
  `,

  // Icon button micro-interactions
  iconButton: `
    transition-all duration-200 ease-out
    hover:bg-slate-800/50
    hover:text-accent-cyan
    active:scale-90
    focus-visible:ring-2 focus-visible:ring-accent-cyan
    rounded-lg
    p-2
  `,

  // Tap target (48px minimum for mobile)
  touchTarget: `
    min-w-[48px] min-h-[48px]
    flex items-center justify-center
  `,
};

/**
 * Container queries for responsive micro-interactions
 * Use these for size-aware styling
 */
export const containerQueries = {
  small: '@container (max-width: 320px)',
  medium: '@container (min-width: 321px) and (max-width: 640px)',
  large: '@container (min-width: 641px)',
};

/**
 * Gesture-aware classes
 * Touch vs Mouse interactions
 */
export const gestures = {
  tap: 'active:scale-95 active:opacity-90',
  hover: 'hover:shadow-lg hover:border-accent-cyan/50',
  focus: 'focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:outline-none',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
};

/**
 * Build consistent micro-interaction class names
 */
export function buildButtonClasses(variant: 'primary' | 'secondary' | 'subtle' = 'primary'): string {
  return microInteractions.button[variant];
}

export function buildCardClasses(interactive?: boolean): string {
  return interactive ? microInteractions.card.interactive : microInteractions.card.default;
}

/**
 * Hover lift effect
 * Apply to cards and containers for elevation
 */
export const hoverLift = `
  transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
  hover:translate-y-[-8px]
  hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)]
`;

/**
 * Smooth transitions
 */
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-200 ease-out',
  smooth: 'transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)',
  slow: 'transition-all duration-500 ease-out',
};

/**
 * Glow effects
 */
export const glows = {
  subtle: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  medium: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
  strong: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
  purple: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
};

/**
 * Scale animations
 */
export const scales = {
  tap: 'active:scale-95',
  hover: 'hover:scale-105',
  pressed: 'active:scale-90',
};

/**
 * Pulse and breathing effects
 */
export const breathing = `
  animate-pulse-slow
  motion-safe:animate-pulse
`;

/**
 * Accessibility-aware animations
 * Respects prefers-reduced-motion
 */
export const a11yAnimations = {
  fadeIn: 'motion-safe:animate-fade-in',
  slideIn: 'motion-safe:animate-slide-in-right',
  scaleIn: 'motion-safe:animate-fade-in-scale',
};
