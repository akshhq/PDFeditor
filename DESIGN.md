# PDFeditz design system

## Direction

PDFeditz uses an editorial document-desk language: warm paper surfaces, ink-black type, cobalt actions, orange emphasis, and clear rules.

## Principles

- Make the next document action obvious.
- Prefer hierarchy and whitespace over decoration.
- Use dense lists for tool discovery.
- Keep status, errors, focus, and disabled states explicit.
- Preserve readability in light, dark, and RTL layouts.

## Tokens

- Background: warm paper
- Foreground: ink
- Primary: cobalt
- Accent: orange
- Border: warm gray
- Body font: self-hosted Inter
- Technical font: self-hosted JetBrains Mono

## Components

Use existing primitives in `src/components/ui` before creating new components. Keep elevation restrained, use one border or shadow treatment per surface, and avoid gradient text, decorative glass effects, and placeholder controls.
