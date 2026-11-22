import type { DocumentElement, DocumentIR } from '../ir';
import { DOCUMENT_IR_VERSION, parseDocumentIR } from '../ir';

interface TextItem {
  str: string;
  transform: number[];
  width?: number;
  height?: number;
  hasEOL?: boolean;
}

interface TextContentPage {
  getTextContent(): Promise<{ items: unknown[] }>;
  getViewport(options: { scale: number }): { width: number; height: number; rotation?: number };
}

interface PDFDocumentLike {
  numPages: number;
  getPage(pageNumber: number): Promise<TextContentPage>;
  getMetadata?(): Promise<{ info?: unknown }>;
}

function isTextItem(item: unknown): item is TextItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<TextItem>;
  return typeof candidate.str === 'string' &&
    Array.isArray(candidate.transform) &&
    candidate.transform.length >= 6;
}

function classifyText(text: string, fontSize: number, averageFontSize: number): DocumentElement['type'] {
  const trimmed = text.trim();
  if (/^(?:[-*•]|\d+[.)])\s+/.test(trimmed)) return 'list';
  if (/^(?:\d+(?:\.\d+)*|[A-Z])(?:[.)]|\s)/.test(trimmed) && fontSize >= averageFontSize) {
    return 'heading';
  }
  if (fontSize >= averageFontSize * 1.35) return 'heading';
  return 'paragraph';
}

export async function extractPdfDocumentIR(
  pdf: PDFDocumentLike,
  filename: string,
  pageNumbers?: readonly number[],
): Promise<DocumentIR> {
  const selectedPages = pageNumbers && pageNumbers.length > 0
    ? pageNumbers.filter((page) => page >= 1 && page <= pdf.numPages)
    : Array.from({ length: pdf.numPages }, (_, index) => index + 1);
  const pages: DocumentIR['document']['pages'] = [];

  for (const pageNumber of selectedPages) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const items = (await page.getTextContent()).items.filter(isTextItem);
    const fontSizes = items
      .map((item) => Math.abs(item.transform[3] || item.height || 0))
      .filter((size) => size > 0);
    const averageFontSize = fontSizes.length > 0
      ? fontSizes.reduce((sum, size) => sum + size, 0) / fontSizes.length
      : 12;

    const sortedItems = [...items].sort((a, b) => {
      const yDifference = b.transform[5] - a.transform[5];
      return Math.abs(yDifference) < 4 ? a.transform[4] - b.transform[4] : yDifference;
    });

    const elements: DocumentElement[] = [];
    let current: {
      text: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
    } | null = null;

    const flush = () => {
      if (!current || !current.text.trim()) return;
      const bbox: [number, number, number, number] = [
        current.x,
        current.y,
        current.x + current.width,
        current.y + current.height,
      ];
      elements.push({
        type: classifyText(current.text, current.fontSize, averageFontSize),
        text: current.text.trim(),
        bbox,
        pageNumber,
        readingOrder: elements.length,
        source: 'native-text',
      });
      current = null;
    };

    for (const item of sortedItems) {
      const fontSize = Math.abs(item.transform[3] || item.height || 0) || averageFontSize;
      const x = item.transform[4];
      const y = item.transform[5];
      const width = item.width || 0;
      const height = item.height || fontSize;
      const startsNewLine = current &&
        (Math.abs(current.y - y) > Math.max(4, current.fontSize * 0.6) ||
          (item.hasEOL && current.text.length > 0));

      if (startsNewLine) flush();
      if (!current) {
        current = { text: item.str, x, y, width, height, fontSize };
      } else {
        const gap = x - (current.x + current.width);
        const needsSpace = gap > 2 || /[A-Za-z0-9]$/.test(current.text) && /^[A-Za-z0-9]/.test(item.str);
        current.text += `${needsSpace ? ' ' : ''}${item.str}`;
        current.width = Math.max(current.width, x + width - current.x);
        current.height = Math.max(current.height, height);
        current.fontSize = Math.max(current.fontSize, fontSize);
      }
    }
    flush();

    pages.push({
      pageNumber,
      width: viewport.width,
      height: viewport.height,
      rotation: viewport.rotation || 0,
      elements,
    });
  }

  const metadataValue = pdf.getMetadata ? (await pdf.getMetadata()).info : undefined;
  const metadata = metadataValue && typeof metadataValue === 'object'
    ? metadataValue as Record<string, unknown>
    : undefined;
  return parseDocumentIR({
    schemaVersion: DOCUMENT_IR_VERSION,
    document: {
      filename,
      pageCount: pdf.numPages,
      metadata,
      pages,
    },
  });
}
