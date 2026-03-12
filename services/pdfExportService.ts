/**
 * PDF Export Service
 * 
 * Generates professional PDF reports for fact-check analyses,
 * chat sessions, and threat matrix screenshots using jsPDF + html2canvas.
 * Fully client-side — no server dependencies.
 * 
 * jsPDF and html2canvas are dynamically imported to avoid loading ~320KB
 * on pages that don't use PDF export.
 */

import type jsPDF from 'jspdf';
import { FactCheckReport } from '../utils/factCheckReport';

async function loadJsPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

async function loadHtml2Canvas() {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas;
}

// ── Shared Constants ──
const COLORS = {
  bg: '#0f172a',
  headerBg: '#020617',
  accent: '#06b6d4',
  text: '#f8fafc',
  muted: '#94a3b8',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  border: '#334155',
} as const;

const FONT = { normal: 'helvetica', bold: 'helvetica' } as const;
const PAGE = { margin: 20, width: 210, height: 297 } as const;
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

// ── Helpers ──
function addHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(COLORS.headerBg);
  doc.rect(0, 0, PAGE.width, 40, 'F');

  doc.setFillColor(COLORS.accent);
  doc.rect(0, 40, PAGE.width, 1, 'F');

  doc.setFont(FONT.bold, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(COLORS.accent);
  doc.text('DISINFO DESK', PAGE.margin, 18);

  doc.setFontSize(8);
  doc.setTextColor(COLORS.muted);
  doc.text(title.toUpperCase(), PAGE.margin, 26);

  doc.setFontSize(7);
  doc.text(subtitle, PAGE.margin, 33);
}

function addFooter(doc: jsPDF, pageNum: number) {
  const y = PAGE.height - 10;
  doc.setFontSize(6);
  doc.setTextColor(COLORS.muted);
  doc.text(`DisinfoDesk · Fact-Check Report · Page ${pageNum}`, PAGE.margin, y);
  doc.text(new Date().toISOString(), PAGE.width - PAGE.margin, y, { align: 'right' });
}

function ensureSpace(doc: jsPDF, y: number, needed: number, pageNum: { value: number }): number {
  if (y + needed > PAGE.height - 20) {
    doc.addPage();
    pageNum.value++;
    addFooter(doc, pageNum.value);
    return 50;
  }
  return y;
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

// ── 1. Fact-Check Report PDF ──
export async function exportFactCheckPDF(report: FactCheckReport): Promise<void> {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  const pageNum = { value: 1 };

  // Header
  addHeader(doc, `FACT-CHECK REPORT · ${report.reportType}`, `ID: ${report.id} · Lang: ${report.language.toUpperCase()} · Generated: ${report.generatedAt}`);
  addFooter(doc, 1);

  let y = 50;

  // Title
  doc.setFont(FONT.bold, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(COLORS.text);
  const titleLines = wrapText(doc, report.title, CONTENT_WIDTH);
  doc.text(titleLines, PAGE.margin, y);
  y += titleLines.length * 7 + 4;

  // Summary
  if (report.summary) {
    doc.setFillColor('#1e293b');
    doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 4, 1, 1, 'F');
    y += 8;

    doc.setFont(FONT.bold, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.accent);
    doc.text('EXECUTIVE SUMMARY', PAGE.margin, y);
    y += 6;

    doc.setFont(FONT.normal, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    const summaryLines = wrapText(doc, report.summary, CONTENT_WIDTH);
    for (const line of summaryLines) {
      y = ensureSpace(doc, y, 5, pageNum);
      doc.text(line, PAGE.margin, y);
      y += 4;
    }
    y += 4;
  }

  // Findings
  if (report.findings.length > 0) {
    y = ensureSpace(doc, y, 15, pageNum);
    doc.setFont(FONT.bold, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.accent);
    doc.text('FINDINGS', PAGE.margin, y);
    y += 6;

    doc.setFont(FONT.normal, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);

    for (let i = 0; i < report.findings.length; i++) {
      const lines = wrapText(doc, `${i + 1}. ${report.findings[i]}`, CONTENT_WIDTH - 5);
      for (const line of lines) {
        y = ensureSpace(doc, y, 5, pageNum);
        doc.text(line, PAGE.margin + 3, y);
        y += 4;
      }
      y += 2;
    }
  }

  // References
  if (report.references.length > 0) {
    y = ensureSpace(doc, y, 15, pageNum);
    doc.setFont(FONT.bold, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.accent);
    doc.text('REFERENCES', PAGE.margin, y);
    y += 6;

    doc.setFontSize(7);
    doc.setFont(FONT.normal, 'normal');

    for (const ref of report.references) {
      y = ensureSpace(doc, y, 8, pageNum);
      doc.setTextColor(COLORS.text);
      doc.text(`• ${ref.title}`, PAGE.margin + 3, y);
      if (ref.url) {
        y += 3.5;
        doc.setTextColor(COLORS.accent);
        doc.textWithLink(ref.url, PAGE.margin + 6, y, { url: ref.url });
      }
      y += 5;
    }
  }

  // Disclaimer
  if (report.disclaimer) {
    y = ensureSpace(doc, y, 20, pageNum);
    y += 5;
    doc.setFillColor('#1c1917');
    doc.roundedRect(PAGE.margin, y - 4, CONTENT_WIDTH, 16, 1, 1, 'F');
    doc.setFont(FONT.bold, 'bold');
    doc.setFontSize(7);
    doc.setTextColor(COLORS.warning);
    doc.text('DISCLAIMER', PAGE.margin + 4, y);
    doc.setFont(FONT.normal, 'normal');
    doc.setFontSize(6);
    doc.setTextColor(COLORS.muted);
    const disclaimerLines = wrapText(doc, report.disclaimer, CONTENT_WIDTH - 8);
    doc.text(disclaimerLines.slice(0, 3), PAGE.margin + 4, y + 4);
  }

  const safeName = report.title.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  doc.save(`DisinfoDesk_FactCheck_${safeName}.pdf`);
}

// ── 2. Chat Session PDF ──
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

export async function exportChatPDF(
  messages: ChatMessage[],
  sessionTitle?: string
): Promise<void> {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  const pageNum = { value: 1 };
  const title = sessionTitle || 'Chat Session';

  addHeader(doc, 'DEBUNK CHAT · SESSION TRANSCRIPT', `${title} · ${messages.length} messages · ${new Date().toISOString()}`);
  addFooter(doc, 1);

  let y = 50;

  doc.setFont(FONT.bold, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(COLORS.text);
  doc.text(title, PAGE.margin, y);
  y += 10;

  for (const msg of messages) {
    y = ensureSpace(doc, y, 20, pageNum);

    const isUser = msg.role === 'user';
    const bgColor = isUser ? '#1e3a5f' : '#1a1a2e';
    const labelColor = isUser ? '#38bdf8' : COLORS.accent;
    const label = isUser ? 'USER' : 'DR. VERITAS';

    doc.setFillColor(bgColor);
    const textLines = wrapText(doc, msg.text, CONTENT_WIDTH - 10);
    const blockH = Math.max(textLines.length * 4 + 10, 14);

    y = ensureSpace(doc, y, blockH + 4, pageNum);
    doc.roundedRect(PAGE.margin, y - 2, CONTENT_WIDTH, blockH, 2, 2, 'F');

    doc.setFont(FONT.bold, 'bold');
    doc.setFontSize(6);
    doc.setTextColor(labelColor);
    doc.text(label, PAGE.margin + 4, y + 3);

    if (msg.timestamp) {
      doc.setTextColor(COLORS.muted);
      doc.text(new Date(msg.timestamp).toLocaleTimeString(), PAGE.width - PAGE.margin - 4, y + 3, { align: 'right' });
    }

    doc.setFont(FONT.normal, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLORS.text);
    doc.text(textLines, PAGE.margin + 4, y + 8);

    y += blockH + 4;
  }

  doc.save(`DisinfoDesk_Chat_${Date.now()}.pdf`);
}

// ── 3. Element Screenshot PDF ──
export async function exportElementPDF(
  element: HTMLElement,
  title: string = 'Threat Matrix Screenshot'
): Promise<void> {
  const [JsPDF, html2canvas] = await Promise.all([loadJsPDF(), loadHtml2Canvas()]);
  const canvas = await html2canvas(element, {
    backgroundColor: COLORS.bg,
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = CONTENT_WIDTH;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const doc = new JsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: imgHeight > PAGE.height - 80 ? 'landscape' : 'portrait',
  });

  addHeader(doc, 'VISUAL EXPORT', `${title} · ${new Date().toISOString()}`);
  addFooter(doc, 1);

  doc.addImage(imgData, 'PNG', PAGE.margin, 50, imgWidth, imgHeight);

  const safeName = title.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  doc.save(`DisinfoDesk_${safeName}.pdf`);
}
