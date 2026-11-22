# Third-party notices

PDFeditz is distributed under the repository license in [LICENSE](./LICENSE).
This file records the direct runtime libraries used by the local processing
features. Transitive notices remain governed by their package distributions
and lockfile.

| Dependency | Version in this project | Use | License / attribution |
|---|---:|---|---|
| Next.js | 15.5.29 installed (`^15.1.8` manifest range) | Static application and routing | MIT |
| React | 19.2.4 installed (`^19.0.0` manifest range) | User interface | MIT |
| pdf-lib | 1.17.1 | PDF creation and modification | MIT |
| PDF.js (`pdfjs-dist`) | 4.8.69 | Rendering, text, outline, and annotation extraction | Apache-2.0 |
| Tesseract.js | 6.0.1 | Browser OCR fallback and language models | Apache-2.0; language data is distributed separately and must retain its upstream notices |
| PyMuPDF / Pyodide assets | See `public/pymupdf-wasm/` | Optional local compression and document conversion | Review MuPDF/PyMuPDF licensing before redistribution; do not treat it as an unrestricted permissive dependency |
| LibreOffice WASM | See `public/libreoffice-wasm/` | Office-format conversion | MPL-2.0; retain LibreOffice notices and source obligations |
| qpdf WASM | See `public/qpdf.wasm` | Structural PDF security operations | Apache-2.0 |
| node-forge | 1.3.3 | Certificates, CMS, and signature operations | BSD-3-Clause |
| JSZip | 3.10.1 | Archive packaging | MIT or GPL-3.0 dual license |
| Zod | 3.25.76 | Runtime validation of the unified document IR | MIT |

## Model and engine policy

The repository does not currently bundle PaddleOCR, PP-OCR, Surya, Docling,
MinerU, Table Transformer, TableFormer, ONNX Runtime Web, Transformers.js,
veraPDF, or OpenCV.js model/runtime assets. They remain optional roadmap items
until a browser-compatible build, pinned version, model-weight license, and
redistribution terms have been verified. No hosted model or remote inference
endpoint is required by the application.

Model downloads, when added, must be version-pinned, disclosed to the user,
cached locally, and accompanied by the model's license and attribution.
