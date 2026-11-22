# PDFeditz roadmap

## Product

- [x] Establish PDFeditz branding and AkshHQ ownership.
- [x] Preserve the Next.js, React, TypeScript, localization, and static-export foundation.
- [ ] Add final supplied logo assets when available.

## User experience

- [x] Replace the homepage visual system with the editorial document-desk layout.
- [x] Keep light, dark, responsive, keyboard, and RTL support.
- [ ] Review every tool workspace for consistent empty, loading, success, and error states.
- [ ] Review mobile navigation and dense document workspaces on small screens.

## PDF capabilities

- [x] Add a versioned unified document IR with runtime validation and PDF.js extraction.
- [x] Add a capability-aware local engine registry with lifecycle and support checks.
- [x] Add a reusable Tesseract OCR adapter that exposes word boxes, confidence, language, and provenance.
- [ ] Validate the core organize, edit, convert, optimize, secure, OCR, and extraction tools with representative files.
- [ ] Improve worker cleanup and object-URL lifecycle coverage.
- [ ] Document limitations for native text editing, OCR, redaction, password handling, and office conversion.
- [ ] Add an optional browser-compatible PaddleOCR/PP-OCR adapter after selecting a maintained, redistributable model build.
- [ ] Add optional ONNX Runtime Web/Transformers.js inference only after model assets, memory usage, and licenses are verified.
- [ ] Add optional desktop adapters for Docling, MinerU, veraPDF, and advanced OpenCV processing.
- [ ] Add IR-backed table structure recognition, invoice validation, retrieval, summarization, and classification.

## Quality

- [ ] Resolve the existing PDF multi-tool select-all regression.
- [x] Add the ESLint 9 flat configuration required by the current lint command.
- [x] Add focused schema tests for the unified document IR.
- [ ] Expand output-validity tests for large, scanned, annotated, and encrypted PDFs.
- [ ] Run browser-level smoke tests against the static export.
