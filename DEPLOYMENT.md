# PDFeditz deployment

PDFeditz produces a static export and can run on any host that serves HTML, JavaScript, CSS, fonts, and large binary assets.

## Build

```powershell
npm install
npm run build
```

The deployable output is `out/`.

## Vercel services

The repository includes a Vercel configuration in `vercel.json`:

- `app` is the public Next.js static export and serves every public path.
- No service bindings are configured because the repository contains no
  service-to-service requests or server-side API.

The `src-tauri` directory is a desktop binary, not a Vercel HTTP service. It
remains in the repository for Tauri releases and is intentionally excluded from
the Vercel deployment.

## Static hosting

Configure the host to:

1. Publish `out/`.
2. Serve localized route fallbacks.
3. Preserve `application/wasm` and `application/octet-stream` content types.
4. Preserve `Content-Encoding: gzip` for precompressed `.gz` assets.
5. Apply the security headers in `security-headers.conf` or the equivalent host configuration.
6. Allow large static assets required by the WebAssembly tools.

## Base paths

Build for a subdirectory with `BASE_PATH`:

```powershell
$env:BASE_PATH = '/pdfeditz'
npm run build
```

The same value must be configured in the hosting platform's public URL.

## Local production preview

The export can be inspected with any static file server. For a Next.js server preview, use:

```powershell
npm run start
```

## Optional desktop package

The Tauri application is maintained separately from the static web export:

```powershell
npm run dev:tauri
npm run build:tauri
```

Desktop builds require the Rust toolchain and the platform prerequisites documented by Tauri.

## Deployment checklist

- Confirm `npm run build` completes.
- Confirm the `out/manifest.webmanifest` file is served.
- Confirm `/en/`, `/en/tools/`, and a representative tool route load directly.
- Confirm WebAssembly assets return the expected content type.
- Confirm cross-origin isolation headers are enabled where shared memory is required.
- Confirm no document upload endpoint has been introduced.
