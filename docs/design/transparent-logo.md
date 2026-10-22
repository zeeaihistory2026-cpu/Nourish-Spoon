# Transparent logo edit

Saved asset: `apps/mobile/assets/website/logo-transparent.png`, derived from the unchanged website reference `logo-2.jpg` using the built-in imagegen tool. No CLI/API fallback was used. App UI and native launch views tint the mark with the website gold `#C9A84C` while preserving its alpha.

Final edit prompt:

> Precise background extraction for existing Nourish Spoon website brand mark, preserve exact source geometry. Output the same N, spoon, chef hat, circle and TM as flat matte muted gold linework with stroke color RGB(201,168,76), hexadecimal #C9A84C, on genuine transparent alpha background. The website source gold is soft olive-gold, NOT saturated yellow or orange. No metallic bevels, highlights, depth, reflections, glow, shadows, texture, noise, halos, or red/yellow artifacts. Only the logo strokes remain; all beige background including internal spaces must be 0-alpha. Keep complete original framing and no cropping. Do not redesign the logo. This PNG must match the website logo color and work on cream #FDF6E3.

The original reference image is preserved at `docs/design/references/website/logo-2.jpg`. The current native launch uses a resolution-independent logo and the traced jar wordmark; `apps/mobile/plugins/android-launch` is authoritative for its geometry and animation.
