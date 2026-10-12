"""Build a review gallery from actual app screenshots, never generated mockups."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = (ROOT / sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "artifacts/feature-preview"
files = [file for file in sorted(OUT.glob("*.png")) if file.name[:2].isdigit() and "validation" not in file.name]
tiles = []
for file in files:
    photo = Image.open(file).convert("RGB")
    photo.thumbnail((216, 480))
    tile = Image.new("RGB", (240, 520), "#FDF6E3")
    tile.paste(photo, ((240-photo.width)//2, 10))
    ImageDraw.Draw(tile).text((8, 495), file.stem[:32], fill="#1B4332")
    tiles.append(tile)
columns = 4
sheet = Image.new("RGB", (columns*240, ((len(tiles)+columns-1)//columns)*520), "#E8E1CC")
for index, tile in enumerate(tiles):
    sheet.paste(tile, ((index % columns)*240, (index//columns)*520))
sheet.save(OUT / "screen-overview.jpg", quality=92)
for start in range(0, len(tiles), 9):
    page_tiles = tiles[start:start+9]
    page = Image.new("RGB", (3*240, ((len(page_tiles)+2)//3)*520), "#E8E1CC")
    for index, tile in enumerate(page_tiles):
        page.paste(tile, ((index % 3)*240, (index//3)*520))
    page.save(OUT / f"preview-sheet-{start//9+1}.jpg", quality=95)
cards = "".join(f'<figure><a href="{escape(file.name)}"><img src="{escape(file.name)}" loading="lazy"></a><figcaption>{escape(file.stem)}</figcaption></figure>' for file in files)
download = f'<p><a href="{escape(sys.argv[2], quote=True)}" style="display:inline-block;padding:14px 20px;border-radius:10px;background:#1B4332;color:white;text-decoration:none">Download all screenshots (ZIP)</a></p>' if len(sys.argv) > 2 else ""
(OUT / "index.html").write_text(f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nourish Spoon screen previews</title><style>body{{background:#FDF6E3;color:#1B4332;font:16px system-ui;margin:24px}}main{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}}figure{{margin:0}}img{{width:100%;max-width:360px;border-radius:12px}}figcaption{{margin:10px 0}}</style><h1>Nourish Spoon screen previews</h1><p>Actual browser renders. Order, address, tracking and notification previews use isolated Firebase test data; test delivery fees are not business rates. These are not Android device screenshots.</p>{download}<main>{cards}</main></html>''', encoding="utf-8")
print(f"Created gallery with {len(files)} screenshots")
