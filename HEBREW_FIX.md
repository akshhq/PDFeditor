# Hebrew and RTL typography

Hebrew interfaces use the locale direction provided by `next-intl` and the browser's native Hebrew-capable system fonts.

## Layout rules

- Keep document controls usable in both directions.
- Use logical margins and padding for new components.
- Do not assume that icon order and text order are identical in RTL layouts.
- Verify mixed Hebrew, Latin, numbers, and file names.

## Validation

Test a Hebrew route after changes to typography or layout:

```text
/he/
/he/tools/
/he/about/
```

Confirm keyboard navigation, focus order, page controls, and action buttons remain clear.
