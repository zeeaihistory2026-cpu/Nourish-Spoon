# Launch wordmark

The Android launch screen draws smooth cubic Bezier outlines fitted to the jar lettering in `assets/website/product-2-main.png`. Subpixel stair steps and disconnected image flecks are removed. The distinctive initials and italic capitals are retained; the original font is unidentified.

Regenerate with `tooling/artwork/trace-jar-wordmark.py` and its adjacent `fit_brand_curves.py` helper (Python, Pillow and NumPy). This updates the plugin template and Android raw resource. Android draws these paths at screen resolution, without enlarging a text bitmap. The logo geometry, placement and animation timing are unchanged.

The obsolete Great Vibes font was removed after startup stopped using it. App text fonts are loaded from the declared Expo Google Fonts packages; no duplicate font binaries are kept here.
