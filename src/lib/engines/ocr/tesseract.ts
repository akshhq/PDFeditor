import { createWorker, type ImageLike, type Worker } from 'tesseract.js';
import type { DocumentElement } from '@/lib/document';
import type { OCREngine, OCREngineOptions, OCRResult, OCRWord } from './types';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export class TesseractOCREngine implements OCREngine {
  readonly id = 'tesseract';
  readonly version = '6.0.1';
  private worker: Worker | null = null;
  private languages: string[] = [];

  isSupported(): boolean {
    return isBrowser();
  }

  async initialize(
    options: OCREngineOptions,
    reportProgress?: (progress: number, message?: string) => void,
  ): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Tesseract OCR requires a browser canvas environment');
    }

    const languages = options.languages.length > 0 ? [...options.languages] : ['eng'];
    if (this.worker && languages.join('+') === this.languages.join('+')) return;
    await this.dispose();

    this.languages = languages;
    this.worker = await createWorker(languages.join('+'), 1, {
      logger: (message) => {
        const progress = Math.round((message.progress || 0) * 100);
        reportProgress?.(progress, message.status);
      },
    });
    if (options.parameters) {
      await this.worker.setParameters(options.parameters);
    }
  }

  async recognize(
    image: HTMLCanvasElement | ImageData,
    options: OCREngineOptions,
    reportProgress?: (progress: number, message?: string) => void,
  ): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize(options, reportProgress);
    }
    if (!this.worker) throw new Error('Tesseract OCR worker was not initialized');

    const result = await this.worker.recognize(image as unknown as ImageLike, {}, {
      text: true,
      blocks: true,
      hocr: true,
    });
    const legacyData = result.data as typeof result.data & {
      words?: Array<{
        text: string;
        confidence?: number;
        bbox: { x0: number; y0: number; x1: number; y1: number };
        symbols?: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
      }>;
    };
    const recognizedWords = legacyData.words && legacyData.words.length > 0
      ? legacyData.words
      : (result.data.blocks || [])
        .flatMap((block) => block.paragraphs || [])
        .flatMap((paragraph) => paragraph.lines || [])
        .flatMap((line) => line.words || []);
    const words: OCRWord[] = recognizedWords
      .map((word) => ({
        text: word.text,
        confidence: Math.max(0, Math.min(1, (word.confidence ?? 90) / 100)),
        bbox: [word.bbox.x0, word.bbox.y0, word.bbox.x1, word.bbox.y1],
        chars: (word.symbols || []).map((symbol) => ({
          text: symbol.text,
          bbox: [symbol.bbox.x0, symbol.bbox.y0, symbol.bbox.x1, symbol.bbox.y1],
        })),
      }));
    const pageNumber = options.pageNumber || 1;
    const elements: DocumentElement[] = [{
      type: 'paragraph',
      text: result.data.text,
      pageNumber,
      source: 'ocr',
      language: this.languages.join('+'),
      confidence: words.length > 0
        ? words.reduce((sum, word) => sum + word.confidence, 0) / words.length
        : undefined,
    }];

    return {
      text: result.data.text,
      words,
      elements,
      language: this.languages.join('+'),
      engine: `${this.id}@${this.version}`,
    };
  }

  async dispose(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
    this.languages = [];
  }
}
