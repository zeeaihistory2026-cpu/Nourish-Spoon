These assets were downloaded from the public Nourish Spoon website on 2026-10-11 for the user's requested website/app design alignment.

Source base URL: https://nourishspoon.com/assets/images/

- logo-2.jpg: unchanged website logo reference. Runtime screens and launcher use logo-transparent.png.
- logo-transparent.png: transparent cutout prepared with the built-in imagegen tool from logo-2.jpg. Edit prompt: remove the beige texture and preserve the N, spoon, chef hat, circle and TM with complete framing and muted website gold. UI tint uses #C9A84C so the displayed color matches the website palette.
- banner-1.png, banner-2.jpg, banner-4.png, banner-5.png, banner-6.png, banner-7.png: the six promotional carousel images, in website order. The website's banner-2.png contains JPEG bytes and is bundled with the correct .jpg extension for Android; the image bytes are unchanged.
- product-1-main.png and product-2-main.png: website product artwork, without baked-in navigation or favorite controls.
- description-image.png: website home hero product illustration.
- review-1.png through review-12.png: the screenshots displayed on the public testimonials page. The 12 corresponding published reviews are preserved in packages/catalog/websiteReviews.json as a snapshot taken on 2026-10-11.

Website typography is Cormorant Garamond for display text and Jost for body text. Fonts are bundled from the corresponding Expo Google Fonts packages. No website account, cookies, or private data are included.

Current runtime uses banner-1, banner-4 and banner-5 as fixed-height hero backgrounds. Unused banners, the original textured logo and description poster are preserved under docs/design/website-originals rather than bundled in the app. Product cards use the original product photographs; combos use assets/products/combo-pack.png (see docs/design/combo-artwork.md).

The previous website hero banners are archived under `docs/design/website-originals`. The current mobile hero uses the three cream assets under `assets/hero`; see `docs/design/hero-artwork.md` for provenance.
