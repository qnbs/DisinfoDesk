export interface FactCheckReport {
  generatedAt: string;
  reportType: 'THEORY' | 'MEDIA';
  id: string;
  title: string;
  language: 'de' | 'en';
  summary?: string;
  findings: string[];
  references: Array<{
    title: string;
    url?: string;
    sourceType?: string;
  }>;
  disclaimer?: string;
  metadata?: Record<string, unknown>;
}

const safeFilePart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');

export const downloadFactCheckReport = (report: FactCheckReport) => {
  const payload = {
    ...report,
    generatedAt: report.generatedAt || new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fact-check-report-${safeFilePart(report.reportType)}-${safeFilePart(report.id)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
