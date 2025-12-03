
import { Category, CategoryEn } from '../types';

export const VIZ_COLORS = {
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#10b981',
  slate: '#64748b',
  orange: '#f97316'
};

export const CATEGORY_COLORS: Record<string, string> = {
  [Category.HISTORICAL]: VIZ_COLORS.yellow,
  [CategoryEn.HISTORICAL]: VIZ_COLORS.yellow,
  [Category.MODERN_MYTHS]: VIZ_COLORS.cyan,
  [CategoryEn.MODERN_MYTHS]: VIZ_COLORS.cyan,
  [Category.PSEUDOSCIENCE]: VIZ_COLORS.purple,
  [CategoryEn.PSEUDOSCIENCE]: VIZ_COLORS.purple,
  [Category.GEOPOLITICS]: VIZ_COLORS.red,
  [CategoryEn.GEOPOLITICS]: VIZ_COLORS.red,
  [Category.HEALTH]: VIZ_COLORS.green,
  [CategoryEn.HEALTH]: VIZ_COLORS.green,
  [Category.ESOTERIC]: VIZ_COLORS.slate,
  [CategoryEn.ESOTERIC]: VIZ_COLORS.slate,
};
