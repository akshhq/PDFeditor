# Arabic and RTL typography

PDFeditz supports Arabic and other right-to-left locales through the locale layout and the Arabic font variable defined in `src/lib/fonts.ts`.

## Implementation

- Locale direction is set on the localized application root.
- Arabic UI text uses the bundled Noto Sans Arabic font when available.
- PDF text layers retain their own rendering rules and receive an RTL-safe fallback.
- Direction-aware spacing uses logical CSS properties where possible.

## Validation

Test an Arabic route after changes to typography or layout:

```text
/ar/
/ar/tools/
/ar/about/
```

Check navigation order, form labels, modal actions, toolbars, page controls, and mixed Arabic/Latin text.
