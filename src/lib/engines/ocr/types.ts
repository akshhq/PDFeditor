import type { DocumentElement } from '@/lib/document';

export interface OCREngineOptions {
  languages: readonly string[];
  pageNumber?: number;
  parameters?: Record<string, string>;
}

export interface OCRWord {
  text: string;
  confidence: number;
  bbox: [number, number, number, number];
  chars?: Array<{ text: string; bbox: [number, number, number, number] }>;
}

export interface OCRResult {
  text: string;
  words: OCRWord[];
  elements: DocumentElement[];
  language: string;
  engine: string;
}

export interface OCREngine {
  readonly id: string;
  readonly version: string;
  initialize(options: OCREngineOptions, reportProgress?: (progress: number, message?: string) => void): Promise<void>;
  recognize(
    image: HTMLCanvasElement | ImageData,
    options: OCREngineOptions,
    reportProgress?: (progress: number, message?: string) => void,
  ): Promise<OCRResult>;
  dispose(): Promise<void>;
  isSupported(): boolean;
}
