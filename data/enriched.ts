
import { Theory, Author } from '../types';
import { THEORIES_DE, THEORIES_EN } from './index';
import { AUTHORS_DATA } from './authors';
import { generateArt } from '../utils/artEngine';

// --- DATA AGGREGATION & ENRICHMENT ---

export const THEORIES_DE_FULL: Theory[] = THEORIES_DE.map(t => ({
    ...t,
    imageUrl: generateArt(t.id, t.category, t.title)
}));

export const THEORIES_EN_FULL: Theory[] = THEORIES_EN.map(t => ({
    ...t,
    imageUrl: generateArt(t.id, t.category, t.title)
}));

export const AUTHORS_FULL: Author[] = AUTHORS_DATA.map(a => ({
    ...a,
    imageUrl: generateArt(a.id, 'AUTHOR', a.name)
}));
