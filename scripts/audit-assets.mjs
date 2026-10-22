import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mobile = path.join(root, "apps/mobile");
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
const references = new Set();
const missing = [];
function record(file) {
  const absolute = path.resolve(file);
  references.add(absolute);
  if (!fs.existsSync(absolute)) missing.push(path.relative(root, absolute));
}
const sources = [
  path.join(mobile, "App.tsx"),
  ...files(path.join(mobile, "src")),
  ...files(path.join(mobile, "plugins")),
].filter((file) => /\.(tsx?|[cm]?js)$/.test(file));
for (const file of sources) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/require\(["']([^"']+)["']\)/g)) {
    if (match[1].startsWith(".") && /\/assets\//.test(match[1]))
      record(path.resolve(path.dirname(file), match[1]));
  }
  // Native config plugins copy assets without using Metro's require().
  for (const match of source.matchAll(
    /["'](assets\/[^"']+\.(?:png|jpe?g|ttf|txt))["']/g,
  ))
    record(path.join(mobile, match[1]));
}
function inspectConfig(value) {
  if (typeof value === "string" && value.startsWith("./assets/"))
    record(path.join(mobile, value));
  else if (value && typeof value === "object")
    Object.values(value).forEach(inspectConfig);
}
inspectConfig(
  JSON.parse(fs.readFileSync(path.join(mobile, "app.json"), "utf8")),
);
const unused = files(path.join(mobile, "assets")).filter(
  (file) => /\.(png|jpe?g|webp|gif|ttf)$/i.test(file) && !references.has(file),
);
if (missing.length || unused.length) {
  console.error(
    JSON.stringify(
      { missing, unused: unused.map((file) => path.relative(root, file)) },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} else
  console.log(
    `Asset audit passed: ${references.size} referenced files exist; no unused runtime images or fonts.`,
  );
