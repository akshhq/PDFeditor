import { z } from 'zod';

export const DOCUMENT_IR_VERSION = '1.0';

export const BoundingBoxSchema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

export const DocumentElementTypeSchema = z.enum([
  'heading',
  'paragraph',
  'list',
  'table',
  'image',
  'caption',
  'equation',
  'link',
  'annotation',
  'unknown',
]);

export const DocumentElementSchema = z.object({
  type: DocumentElementTypeSchema,
  text: z.string().optional(),
  bbox: BoundingBoxSchema.optional(),
  confidence: z.number().min(0).max(1).optional(),
  pageNumber: z.number().int().positive(),
  readingOrder: z.number().int().nonnegative().optional(),
  source: z.enum(['native-text', 'ocr', 'inferred']).optional(),
  language: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const DocumentPageSchema = z.object({
  pageNumber: z.number().int().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().finite().default(0),
  elements: z.array(DocumentElementSchema),
});

export const DocumentIRSchema = z.object({
  schemaVersion: z.literal(DOCUMENT_IR_VERSION),
  document: z.object({
    filename: z.string(),
    pageCount: z.number().int().nonnegative(),
    metadata: z.record(z.unknown()).optional(),
    pages: z.array(DocumentPageSchema),
  }),
});

export type BoundingBox = z.infer<typeof BoundingBoxSchema>;
export type DocumentElement = z.infer<typeof DocumentElementSchema>;
export type DocumentPage = z.infer<typeof DocumentPageSchema>;
export type DocumentIR = z.infer<typeof DocumentIRSchema>;

export function parseDocumentIR(value: unknown): DocumentIR {
  return DocumentIRSchema.parse(value);
}

export function safeParseDocumentIR(value: unknown): z.SafeParseReturnType<unknown, DocumentIR> {
  return DocumentIRSchema.safeParse(value);
}
