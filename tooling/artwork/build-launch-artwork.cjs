// Smooth, resolution-independent reconstruction of the approved gold brand mark.
// One source generates both Android's animated paths and its static launcher icon.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const source = [
  ['M198 318 C167 307 134 321 113 349 C93 375 89 408 103 436', false],
  ['M135 472 C164 491 199 489 226 470 C254 450 267 418 261 385', false],
  ['M136 384 C138 394 123 392 117 382 C110 370 119 355 131 355 C153 349 169 376 180 404 C189 426 202 458 231 448', false],
  ['M153 366 L154 408', false],
  ['M153 361 C174 377 181 411 197 434 C207 449 218 455 231 448', false],
  ['M200 438 L200 409 C199 390 208 379 226 382', false],
  ['M168 403 C156 412 146 426 134 427 C118 427 106 440 103 453 C99 465 102 472 114 471 C132 470 146 456 146 439 C146 426 160 419 172 409', false],
  ['M111 463 C127 466 139 454 140 440', false],
  ['M197 357 C185 351 187 332 199 329 C202 328 205 329 208 330', false],
  ['M205 334 C213 315 236 319 243 336 C245 340 245 343 245 346', false],
  ['M244 339 C256 338 263 347 261 356 C260 366 250 374 240 372', false],
  ['M202 348 C203 354 208 357 214 356', false],
  ['M214 347 C214 357 223 364 231 355', false],
  ['M244 361 L238 366', false],
  ['M198 357 C214 353 227 360 241 368 L235 386 C224 377 210 371 194 373 L198 357', false],
  ['M196 369 C211 366 225 372 237 380', false],
  ['M248 321 L256 321', true],
  ['M252 321 L252 330', true],
  ['M259 330 L259 321 L262.5 327 L266 321 L266 330', true],
];
const strokes = source.map(([d, tm]) => {
  let coordinate = 0;
  return { d: d.replace(/-?\d+(?:\.\d+)?/g, value => {
    const center = coordinate++ % 2 === 0 ? 180 : 400;
    return ((Number(value) - center) * 0.8 + 112).toFixed(2);
  }), tm };
});
const templates = path.join(root, 'apps/mobile/plugins/android-launch');
fs.writeFileSync(path.join(templates, 'nourish_logo_strokes.json'), JSON.stringify(strokes, null, 2) + '\n');
fs.writeFileSync(path.join(templates, 'nourish_launch_logo_vector.xml'), `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="224dp" android:height="224dp" android:viewportWidth="224" android:viewportHeight="224">
${strokes.map(s => `  <path android:pathData="${s.d}" android:strokeColor="#C9A84C" android:strokeWidth="${s.tm ? 1.35 : 2.4}" android:strokeLineCap="round" android:strokeLineJoin="round" android:fillColor="@android:color/transparent" />`).join('\n')}
</vector>\n`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" width="224" height="224" fill="none" stroke="#C9A84C" stroke-linecap="round" stroke-linejoin="round">${strokes.map(s => `<path d="${s.d}" stroke-width="${s.tm ? 1.35 : 2.4}"/>`).join('')}</svg>`;
fs.mkdirSync(path.join(root, 'artifacts/logo-hd'), { recursive: true });
fs.writeFileSync(path.join(root, 'artifacts/logo-hd/Nourish-Spoon-Logo-HD.svg'), svg);
console.log(`Generated ${strokes.length} smooth vector strokes, including complete TM lettering.`);
