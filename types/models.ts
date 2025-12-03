
import React from 'react';

// --- Enums ---

export enum DangerLevel {
  LOW = 'Harmlos',
  MEDIUM = 'Bedenklich',
  HIGH = 'Gefährlich',
  EXTREME = 'Demokratiegefährdend'
}

export enum DangerLevelEn {
  LOW = 'Harmless',
  MEDIUM = 'Concerning',
  HIGH = 'Dangerous',
  EXTREME = 'Threat to Democracy'
}

export enum Category {
  HISTORICAL = 'Historische Verschwörungen',
  MODERN_MYTHS = 'Moderne Mythen & Urban Legends',
  PSEUDOSCIENCE = 'Wissenschaftliche Pseudotheorien',
  GEOPOLITICS = 'Geopolitische Verschwörungen',
  HEALTH = 'Gesundheit & Medizin',
  ESOTERIC = 'Esoterik & Grenzwissen'
}

export enum CategoryEn {
  HISTORICAL = 'Historical Conspiracies',
  MODERN_MYTHS = 'Modern Myths & Urban Legends',
  PSEUDOSCIENCE = 'Pseudoscience',
  GEOPOLITICS = 'Geopolitical Conspiracies',
  HEALTH = 'Health & Medicine',
  ESOTERIC = 'Esoteric & Fringe Knowledge'
}

export type SortOption = 'POPULARITY_DESC' | 'POPULARITY_ASC' | 'YEAR_DESC' | 'YEAR_ASC' | 'TITLE_ASC';
export type Language = 'de' | 'en';
export type MediaType = 'MOVIE' | 'BOOK' | 'SERIES' | 'GAME' | 'COMIC';

// --- Entities ---

export interface Theory {
  id: string;
  title: string;
  shortDescription: string;
  category: string; 
  dangerLevel: string; 
  popularity: number; // 0-100
  originYear?: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  relatedIds?: string[];
  isUserCreated?: boolean;
  lastEdited?: number;
}

export interface Author {
  id: string;
  name: string;
  lifespan: string;
  nationality: string;
  imagePlaceholder: string;
  bioDe: string;
  bioEn: string;
  focusAreas: string[];
  keyWorks: string[];
  influenceLevel: number; // 1-100
  website?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  year: number;
  creator: string;
  descriptionDe: string;
  descriptionEn: string;
  tags: string[];
  realityScore: number;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'MINDBENDING';
  relatedTheoryTags: string[];
}

export interface TheoryDetail extends Theory {
  fullDescription: string;
  originStory: string;
  debunking: string;
  scientificConsensus: string;
  sources: SourceItem[];
  lastUpdated?: number;
}

export interface SourceItem {
  title: string;
  url?: string;
  snippet?: string;
  sourceType?: 'WEB' | 'ACADEMIC' | 'NEWS' | 'UNKNOWN';
}
