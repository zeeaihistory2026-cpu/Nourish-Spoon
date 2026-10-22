# Design references and artwork

Production artwork lives beside the app that uses it: `apps/mobile/assets` and `apps/admin/public/assets`. The mobile asset audit checks that every runtime image/font is referenced and available.

Original design references are retained once under `references/`:

- `screens/`: the supplied screen designs, including onboarding and the admin reference.
- `overviews/`: distinct full-app and dashboard overview boards.
- `originals/`: supplied images that do not duplicate a named screen reference.
- `website/`: distinct original website images used as source references.

The earlier website `banner-1.png` is byte-identical to the retained `apps/admin/public/assets/products/product-combo.png`; a second documentation copy is unnecessary. Duplicate screen copies and obsolete extracted crops were archived locally with a recovery manifest before removal. Git history also retains the earlier source inputs.

The current hero backgrounds and exact generation prompts are in `apps/mobile/assets/hero/generation-prompts.json`. [Hero artwork history](hero-artwork.md), [combo artwork](combo-artwork.md) and [transparent logo](transparent-logo.md) record their provenance. The original references are design inputs, not screenshots claiming a feature is implemented.

Artwork regeneration utilities live in `tooling/artwork`; screenshot-gallery authoring lives in `tooling/previews`. These are optional authoring tools, separate from production builds.

Dashboard image URLs can also be stored in managed content. Do not delete a public asset merely because it is absent from static imports; inspect the corresponding published content first.
