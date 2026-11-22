import { describe, expect, it } from 'vitest';
import { DOCUMENT_IR_VERSION, parseDocumentIR } from './index';

describe('Document IR schema', () => {
  it('accepts a versioned structured document', () => {
    const ir = parseDocumentIR({
      schemaVersion: DOCUMENT_IR_VERSION,
      document: {
        filename: 'example.pdf',
        pageCount: 1,
        pages: [{
          pageNumber: 1,
          width: 612,
          height: 792,
          rotation: 0,
          elements: [{
            type: 'paragraph',
            text: 'Hello',
            bbox: [10, 20, 100, 40],
            pageNumber: 1,
            source: 'native-text',
          }],
        }],
      },
    });

    expect(ir.document.pages[0].elements[0].text).toBe('Hello');
  });

  it('rejects invalid confidence values', () => {
    expect(() => parseDocumentIR({
      schemaVersion: DOCUMENT_IR_VERSION,
      document: {
        filename: 'example.pdf',
        pageCount: 1,
        pages: [{
          pageNumber: 1,
          width: 612,
          height: 792,
          elements: [{
            type: 'paragraph',
            pageNumber: 1,
            confidence: 2,
          }],
        }],
      },
    })).toThrow();
  });
});
