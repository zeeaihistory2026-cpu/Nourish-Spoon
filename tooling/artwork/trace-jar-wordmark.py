"""Outline the existing jar-artwork wordmark as Android/SVG vector paths."""
from collections import defaultdict
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from PIL import Image
from fit_brand_curves import smooth_closed_outline

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "apps/mobile/assets/website/product-2-main.png"
BOX = (115, 120, 308, 151)
FACTOR = 4


image = Image.open(SOURCE).convert("RGB").crop(BOX)
image = image.resize((image.width * FACTOR, image.height * FACTOR), Image.Resampling.BICUBIC)
ink = {
    (x, y) for y in range(image.height) for x in range(image.width)
    if (lambda r, g, b: r - g > 20 and g - b > 15 and r < 200 and g < 160 and b < 115)(*image.getpixel((x, y)))
}
assert ink, "No wordmark ink found"
edges = defaultdict(set)
for x, y in ink:
    for adjacent, start, end in [
        ((x, y - 1), (x, y), (x + 1, y)),
        ((x + 1, y), (x + 1, y), (x + 1, y + 1)),
        ((x, y + 1), (x + 1, y + 1), (x, y + 1)),
        ((x - 1, y), (x, y + 1), (x, y)),
    ]:
        if adjacent not in ink:
            edges[start].add(end)

loops = []
while edges:
    start = next(iter(edges))
    point, previous, loop = start, None, [start]
    while True:
        choices = edges[point]
        if previous is None or len(choices) == 1:
            following = next(iter(choices))
        else:
            dx, dy = point[0] - previous[0], point[1] - previous[1]
            priority = [(point[0] - dy, point[1] + dx), (point[0] + dx, point[1] + dy)]
            following = next((candidate for candidate in priority if candidate in choices), next(iter(choices)))
        choices.remove(following)
        if not choices:
            del edges[point]
        previous, point = point, following
        loop.append(point)
        if point == start:
            break
    area = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(loop, loop[1:]))) / 2
    if area >= FACTOR * FACTOR * 0.15:
        loops.append(loop)

# The crop also catches the bottom of the separate monogram above the lettering.
# Its isolated contour ends before any of the wordmark's letter bodies begin.
loops = [loop for loop in loops if max(y for x, y in loop) > 6 * FACTOR]

left = min(x for loop in loops for x, y in loop)
top = min(y for loop in loops for x, y in loop)
width = (max(x for loop in loops for x, y in loop) - left) / FACTOR
height = (max(y for loop in loops for x, y in loop) - top) / FACTOR


def point_text(point):
    return f"{(point[0] - left) / FACTOR:.3f},{(point[1] - top) / FACTOR:.3f}"


def outline(loop):
    curves = smooth_closed_outline(loop, FACTOR)
    commands = ["M" + point_text(curves[0][0])]
    for curve in curves:
        commands.append("C" + " ".join(point_text(point) for point in curve[1:]))
    return " ".join(commands) + " Z"


def signed_area(loop):
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(loop, loop[1:])) / 2


def contains(loop, point):
    x, y = point
    inside = False
    for (ax, ay), (bx, by) in zip(loop, loop[1:]):
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            inside = not inside
    return inside


# Keep the original letter-by-letter timing, including the pause at the space.
letters = sorted((loop for loop in loops if signed_area(loop) > 20 * FACTOR ** 2), key=lambda loop: min(x for x, y in loop))
assert len(letters) == 12, f"Expected twelve lettering outlines, found {len(letters)}"
details = {id(letter): [] for letter in letters}
center_x = lambda loop: (min(x for x, y in loop) + max(x for x, y in loop)) / 2
for loop in loops:
    if any(loop is letter for letter in letters):
        continue
    # Small disconnected flecks in the photographed lettering are image noise.
    if signed_area(loop) > 0:
        continue
    candidates = [letter for letter in letters if contains(letter, loop[0])] or letters
    parent = min(candidates, key=lambda letter: abs(center_x(loop) - center_x(letter)))
    details[id(parent)].append(loop)
glyphs = []
for index, letter in enumerate(letters):
    glyphs.append({"index": index if index < 7 else index + 1, "path": " ".join(outline(loop) for loop in [letter, *details[id(letter)]])})

record = {"source": "assets/website/product-2-main.png", "sourceBox": list(BOX), "width": width, "height": height, "glyphs": glyphs}
template = ROOT / "apps/mobile/plugins/android-launch/nourish_jar_wordmark.json"
template.write_text(json.dumps(record, separators=(",", ":")), encoding="utf-8")
resource = ROOT / "apps/mobile/android/app/src/main/res/raw/nourish_jar_wordmark.json"
resource.write_bytes(template.read_bytes())

android = "{http://schemas.android.com/apk/res/android}"
logo = ET.parse(ROOT / "apps/mobile/plugins/android-launch/nourish_launch_logo_vector.xml").getroot()
logo_paths = [f'<path d="{p.attrib[android + "pathData"]}" fill="none" stroke="#C9A84C" stroke-width="{p.attrib.get(android + "strokeWidth", "2.4")}" stroke-linecap="round" stroke-linejoin="round"/>' for p in logo]
scale = 200 / width
svg = '<svg xmlns="http://www.w3.org/2000/svg" width="672" height="792" viewBox="0 0 224 264"><rect width="224" height="264" fill="#FDF6E3"/>'
svg += "".join(logo_paths)
svg += f'<g fill="#B28E35" stroke="#B28E35" stroke-width="0.1" stroke-linejoin="round" fill-rule="evenodd" transform="translate(12 201) scale({scale})">'
svg += "".join(f'<path d="{glyph["path"]}"/>' for glyph in glyphs) + '</g></svg>'
out = ROOT / "artifacts/brand-review"
out.mkdir(parents=True, exist_ok=True)
(out / "jar-lettering-launch.svg").write_text(svg, encoding="utf-8")
print(json.dumps({"width": width, "height": height, "glyphs": len(glyphs), "bytes": template.stat().st_size}))
