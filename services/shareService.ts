/**
 * Shareable Links Service
 * 
 * Encodes/decodes theory data into URL-safe, anonymized, read-only share links.
 * No API key or user data is ever included in shared URLs.
 * Uses URL hash params for GitHub Pages compatibility.
 */

import { FactCheckReport } from '../utils/factCheckReport';
import { exportFactCheckPDF } from './pdfExportService';

// ── Share payload (anonymized — no user data, no API keys) ──
export interface SharePayload {
  type: 'theory' | 'report';
  id: string;
  title: string;
  lang: 'de' | 'en';
  summary?: string;
  findings?: string[];
  references?: Array<{ title: string; url?: string }>;
  sharedAt: string;
  version: number;
}

const SHARE_VERSION = 1;

// ── Encode to URL-safe base64 ──
function encodePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  // Compress with simple base64
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── Decode from URL-safe base64 ──
function decodePayload(encoded: string): SharePayload | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as SharePayload;
  } catch {
    return null;
  }
}

// ── Generate a shareable URL ──
export function generateShareLink(payload: Omit<SharePayload, 'sharedAt' | 'version'>): string {
  const full: SharePayload = {
    ...payload,
    sharedAt: new Date().toISOString(),
    version: SHARE_VERSION,
  };
  const encoded = encodePayload(full);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/shared?data=${encoded}`;
}

// ── Parse a share link from current URL ──
export function parseShareLink(): SharePayload | null {
  const hash = window.location.hash;
  const match = hash.match(/[?&]data=([^&]+)/);
  if (!match) return null;
  return decodePayload(match[1]);
}

// ── Check if current URL is a read-only shared view ──
export function isSharedView(): boolean {
  return window.location.hash.includes('/shared?data=');
}

// ── Export share payload as JSON download ──
export function exportShareJSON(payload: SharePayload): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DisinfoDesk_shared_${payload.id}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Export share payload as PDF ──
export async function exportSharePDF(payload: SharePayload): Promise<void> {
  const report: FactCheckReport = {
    generatedAt: payload.sharedAt,
    reportType: payload.type === 'theory' ? 'THEORY' : 'MEDIA',
    id: payload.id,
    title: payload.title,
    language: payload.lang,
    summary: payload.summary,
    findings: payload.findings || [],
    references: (payload.references || []).map(r => ({ title: r.title, url: r.url })),
    disclaimer: 'This is an automatically generated, anonymized export from DisinfoDesk. For educational purposes only.',
  };
  await exportFactCheckPDF(report);
}

// ── Copy share link to clipboard ──
export async function copyShareLink(link: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    // Fallback for insecure contexts
    const textarea = document.createElement('textarea');
    textarea.value = link;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}
