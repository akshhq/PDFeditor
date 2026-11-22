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
- WebAssembly workers for selected conversions and document operations
- Tesseract.js for browser OCR
- Tailwind CSS
- Vitest and Testing Library

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

See `LICENSE` and the repository's existing third-party notices for the applicable licensing terms and attribution requirements.
