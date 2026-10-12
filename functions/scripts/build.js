const fs = require('node:fs');
const path = require('node:path');
const target = path.resolve(__dirname, '../lib');
fs.mkdirSync(target, { recursive: true });
// Frontend consumes ESM; Firebase's Node entry point consumes the generated CommonJS module.
const source = fs.readFileSync(path.resolve(__dirname, '../../packages/catalog/normalizeProduct.js'), 'utf8');
if (!source.includes('export function normalizeProduct')) throw new Error('Unexpected catalogue module format');
fs.writeFileSync(path.join(target, 'normalizeProduct.js'), source.replace('export function normalizeProduct', 'function normalizeProduct') + '\nmodule.exports = { normalizeProduct };\n');
