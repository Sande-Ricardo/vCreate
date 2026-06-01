---
name: Luminous Professional
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#26313f'
  tertiary-container: '#d7e3f5'
  on-tertiary-container: '#596575'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d7e3f5'
  tertiary-fixed-dim: '#bbc8d9'
  on-tertiary-fixed: '#101c29'
  on-tertiary-fixed-variant: '#3c4856'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  title-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  container-max: 1200px
---

## Brand & Style

This design system is built for an intelligent CV generator that balances high-end technical precision with sophisticated elegance. The aesthetic is rooted in a **Modern-Minimalist** approach with **High-Contrast** technical accents, drawing inspiration from high-performance automotive and aerospace interfaces.

The UI should evoke a sense of professional authority, clarity, and "intelligence." The use of ultra-fine silver outlines against a deep midnight void creates a perception of depth and premium quality. Every element is designed to feel surgically precise, mirroring the structured nature of a professional curriculum vitae.

- **Visual Theme:** Technical Elegance.
- **Atmosphere:** Dark, focused, and expensive.
- **Key Motif:** "Transparency Cuts"—the use of double-lined strokes and backlit separators to create architectural structure without heavy bulk.

## Colors

The palette is strictly monochromatic and deep-toned to maximize the "glow" effect of the technical lines.

- **Surface & Void:** The background is a vertical linear gradient starting from **Midnight Blue (#000814)** at the top to **Deep Black (#000000)** at the bottom.
- **Interaction & Data:** **Brilliant White (#FFFFFF)** is reserved for high-priority typography and primary action states.
- **Structure & Outlines:** **Glowing Silver (#E5E5E5)** is used for ultra-thin borders (0.5px - 1px) and decorative separators.
- **Backlighting:** Use low-opacity white (10-15%) for subtle glow effects (box-shadows) around active input fields and primary buttons.

## Typography

The system utilizes **Inter** for its neutral, geometric precision and exceptional legibility at small sizes.

- **Hierarchy:** Use extreme scale differences. Large headlines in `display-lg` should feel like architectural statements.
- **Contrast:** Maintain high contrast by using `Brilliant White` for all text. Use `label-caps` for section headers and form labels to provide a technical, metadata-inspired feel.
- **Spacing:** Tighten letter spacing on large headings to create a compact, modern appearance, while increasing it for small labels to ensure readability against the dark background.

## Layout & Spacing

This design system uses a **Fixed Grid** model on desktop to maintain a cinematic and controlled reading experience.

- **Grid:** A 12-column grid with 24px gutters. Elements should often span 6 or 8 columns to leave ample whitespace (the "void") on the sides.
- **Rhythm:** An 8px linear scale governs all padding and margins.
- **Breakpoints:**
  - **Desktop (1200px+):** Centered container with 80px side margins.
  - **Tablet (768px - 1199px):** Fluid layout with 40px margins.
  - **Mobile (under 768px):** Single column stack with 20px margins. Typography scales down (e.g., `headline-lg` becomes `headline-lg-mobile`).

## Elevation & Depth

Depth is not created with traditional shadows, but through **Tonal Layers** and **Luminous Outlines**.

- **Surfaces:** UI containers (like cards or form sections) should have a background of `rgba(255, 255, 255, 0.03)` with a subtle backdrop blur (10px).
- **Outlines:** Instead of shadows, use "Double Strokes." A 1px outer border of `rgba(229, 229, 229, 0.2)` and a 1px inner border of `rgba(255, 255, 255, 0.05)`.
- **Glow:** Active states utilize a "backlight" effect—a soft, white outer glow (`0 0 15px rgba(255, 255, 255, 0.3)`) that appears to bleed from behind the element.

## Shapes

The design system adopts a **Sharp (0)** roundedness philosophy.

All buttons, input fields, and containers must have 90-degree corners. This reinforces the "technical drawing" aesthetic and aligns with the geometric nature of the reference imagery. The only exception is for circular icon buttons, which should remain perfectly round to act as distinct focal points.

## Components

### Buttons

- **Primary:** Solid `Brilliant White` background with `Deep Black` text. No border. On hover, add a 10px white outer glow.
- **Secondary:** Transparent background with a 1px `Glowing Silver` border. Text in `Brilliant White`. On hover, the border opacity increases to 100%.

### Form Fields

- **Input:** Transparent background with a 1px border of `rgba(225, 225, 225, 0.3)`.
- **Focus State:** Border color changes to `Brilliant White`, and a 0.5px "inner shadow" glow effect is applied to make the field appear backlit.

### Cards

- Cards use the "Transparency Cut" style: no solid background, just an ultra-thin 1px border.
- In the top-right corner of cards, include a small geometric "node" (a 4px white square) to emphasize the technical construction.

### Icons

- Icons must be **Outline** style with a stroke weight of 1px or 1.5px.
- Use `Glowing Silver` for inactive icons and `Brilliant White` for active icons.

### Separators

- Use "Glowing Separators": 1px tall lines that fade to transparent at the edges (radial gradient: `rgba(255,255,255,0.5)` to `transparent`).
