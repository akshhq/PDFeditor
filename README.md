# PDFeditz

PDFeditz is a privacy-first PDF workspace by **AkshHQ**. It provides browser-based tools for organizing, editing, converting, securing, and extracting information from PDF documents.

## Highlights

- Local-first processing for ordinary PDF workflows
- No account, database, or document upload requirement
- Merge, split, extract, rotate, reorder, compress, convert, annotate, sign, OCR, and more
- PDF Studio for multi-step document work
- Workflow automation for repeatable operations
- English, RTL, and additional localized interfaces
- Static export for simple deployment
- Optional Tauri desktop packaging

## Technology

- Next.js and React
- TypeScript
- `pdf-lib` and PDF.js
- Versioned document IR validated with Zod
- Capability-aware local engine registry and switchable OCR adapter
- WebAssembly workers for selected conversions and document operations
- Tesseract.js for browser OCR
- Tailwind CSS
- Vitest and Testing Library

## Feature implementation matrix

PDFeditz does not call a hosted LLM or send documents to an AI API. The
"AI" tools use deterministic layout heuristics, regular expressions, and
local WASM engines. The table below lists the model/engine and the primary
method used by every configured feature.

| Feature/tools | Model, engine, or library | Main methods/algorithms |
|---|---|---|
| Merge, alternate merge, split, extract pages, divide, organize, delete, reverse, rotate, crop, add blank pages, booklet, N-up, grid combine, combine single page, overlay, page labels, page numbers, headers/footers, watermarks, backgrounds, text colors, invert colors, stamps, annotations, flatten, remove blank pages | `pdf-lib` (`PDFDocument`) | Tool processors such as `mergePDFs`, `alternateMergePDFs`, `splitPDF`, `extractPages`, `organizePDF`, `rotatePDF`, and `addWatermark`; `load`, `create`, `copyPages`, `embedPdf`/`embedPages`, page drawing, PDF object/annotation updates, `save`; page-range parsing and coordinate transforms |
| PDF viewer, previews, metadata viewing/editing, compare, search, annotation export, citation links, table of contents, bookmarks, bookmark generation, find-and-redact, dead-link debugging, PDF-to-Markdown, PDF-to-JSON, table extraction, global invoice parsing | PDF.js | `getDocument`, `getPage`, `getTextContent`, `getAnnotations`, `getViewport`, `render`; coordinate sorting, line/column grouping, regex matching, link inspection, and X/Y clustering |
| OCR PDF | Tesseract.js LSTM OCR models (`eng`, `chi_sim`, `chi_tra`, `jpn`, `jpn_vert`, `kor`, `spa`, `fra`, `deu`, `por`, `ara`, `hun`, `ori`) plus PDF.js and `pdf-lib` | `ocrPDF`, Tesseract `recognize`, page segmentation modes 3/5, confidence/word and symbol boxes, CJK spacing normalization, searchable-text overlay |
| Compress PDF | CoherentPDF WASM worker; PyMuPDF WASM for image optimization | Standard structure compression; PyMuPDF `compress` (condense/garbage cleanup); PyMuPDF `photonCompress` (rasterize); configurable DPI, JPEG/PNG quality, metadata and unused-object removal |
| PDF-to-DOCX, PDF-to-PPTX, PDF-to-Excel, PDF-to-Markdown, PDF-to-slide, PDF-to-CBZ/TIFF/SVG/image/ZIP | Pyodide/PyMuPDF WASM workers, PDF.js, `pdf-lib`, and JSZip | `pdf2docx`, `python-docx`, `python-pptx`, `openpyxl`, page rendering, text/geometry extraction, image embedding, rasterization, and ZIP packaging |
| Word, Excel, PowerPoint, RTF, EPUB, MOBI, XPS, DJVU, FB2, CBZ, email, Markdown, text, JSON, image, PSD, JPG, PNG, WebP, SVG, BMP, HEIC, and TIFF to PDF | LibreOffice WASM (`WorkerBrowserConverter`) where office conversion is required; local parsers plus `pdf-lib` for the remaining formats | Headless `soffice` conversion in dedicated workers; format parsing, image embedding, page-size/layout calculation, HTML/Markdown rendering, and `PDFDocument.save` |
| Encrypt, decrypt, remove restrictions, change permissions, repair, linearize, sanitize, deep sanitize, remove metadata, PDF/A, rasterize, font-to-outline, OCG/layer management | qpdf WASM, PyMuPDF WASM, `pdf-lib`, and `node-forge` | qpdf command execution and virtual filesystem cleanup; AES-256 permissions/encryption; PDF object rewriting, metadata removal, raster rebuild, font path conversion, and PDF/A normalization |
| Draw/type/upload signatures, signature library, signature extraction, signature protection, signature ink optimization, digital signing, certificate cryptor, timestamping, signature validation | `pdf-lib`, `node-forge`, `zgapdfsigner`, local signature storage, and optional CSC remote-signing client | Image/data-URL embedding, ink cleanup, annotation protection, PKCS#12/certificate handling, CMS digest/signature verification, SHA-256 timestamps, OAuth/CSC authorization |
| Forms, form creator, form logic designer, attachments, barcode injection, passport ID composer, scratchpad, photo tiling, posterize, e-ink optimization, deskew, handwriting enhancement, spine/booklet prepress | `pdf-lib`, PDF.js, Canvas/ImageData, JSZip, and local geometry/image algorithms | Widget creation/filling/flattening, JavaScript-like rule injection, worker-based attachment operations, barcode/image embedding, thresholding (including Otsu), deskew/rotation, tiling, imposition, and prepress calculations |
| AI PDF reflower, two-column reflower, smart data redactor, auto bookmarks, interactive TOC, signature-anchor helper | No learned model; PDF.js text geometry plus deterministic heuristics | Font-size hierarchy, Y/X coordinate ordering, dual-column detection, paragraph reconstruction, MathJax-style formula detection, regex/entity matching, and outline/link injection |
| PDF Studio and workflow automation | React state, Zustand, PDF.js preview, `pdf-lib` processors, and Web Workers | Tool graph execution, interpolation, conditional branches, progress/cancellation callbacks, reusable processor entry points, and local ZIP/export packaging |

All processing methods are wrapped by `BasePDFProcessor`, which provides file
and PDF-structure validation, progress reporting, cancellation, typed errors,
and success/error outputs. Worker-backed features keep conversion and WASM work
off the main thread; the shared document IR is local and no remote inference
service is used.

### Implementation status

- **Implemented:** unified document IR, Zod validation, PDF.js IR extraction,
  PDF-to-JSON IR output, local engine registry, and Tesseract OCR adapter.
- **Implemented with limitations:** OCR, office conversion, compression,
  redaction, signatures, and security tools use the local engines documented
  above; fidelity and browser-memory limits vary by input.
- **Optional advanced processing:** Tauri/desktop integrations can host
  heavier local engines without making them required for static deployment.
- **Not bundled:** PaddleOCR/PP-OCR, Docling, MinerU, ONNX Runtime Web,
  Transformers.js, Table Transformer, OpenCV.js, and veraPDF remain gated on
  compatible builds, model licenses, and verified browser/runtime behavior.

The current implementation status and optional-engine plan are tracked in
[TODO.md](TODO.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Requirements

- Node.js 20 or newer
- npm
- A current Chromium, Firefox, Safari, or Edge browser

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available commands

```powershell
npm run dev       # Start the development server
npm run build     # Create the static production export
npm run start     # Serve a non-export Next.js build when applicable
npm run lint      # Run ESLint
npm test          # Run the Vitest suite
npx tsc --noEmit  # Run the TypeScript checker
```

## Production deployment

Create the static export:

```powershell
npm run build
```

Deploy the generated `out/` directory to a static host. Configure the host to serve `index.html` fallbacks for localized routes and apply the security headers from the deployment configuration.

For a subpath deployment:

```powershell
$env:BASE_PATH = '/pdfeditz'
npm run build
```

## Privacy

PDFeditz is designed to process ordinary documents in the browser. Files are read from the local device, processed locally, and written back as downloads. Browser memory, device capability, optional remote-signing integrations, and external asset loading are documented separately where relevant.

Local preferences and recent-file metadata may be stored in browser storage. Clear browser storage to remove locally retained preferences.

## Project structure

```text
src/app/                 Routes and page entry points
src/components/          Reusable UI and tool components
src/config/              Site, tool, and localized content configuration
src/lib/document/        Versioned document IR and extraction adapters
src/lib/engines/         Capability-aware local engine registry and adapters
src/lib/pdf/             PDF processors and browser loaders
src/lib/storage/         Local persistence helpers
messages/                Localized application messages
public/                  Static assets and WebAssembly resources
src-tauri/               Optional desktop packaging
```

## Contributing

Keep changes focused, typed, accessible, and compatible with static deployment. New document operations must validate input, report processing errors, release temporary resources, and produce a usable output file.

Before opening a change, run:

```powershell
npx tsc --noEmit
npm test
npm run build
```

## Licensing

See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
for applicable licensing terms and attribution requirements.
