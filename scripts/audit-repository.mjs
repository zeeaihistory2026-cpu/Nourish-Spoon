import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexedOnly = process.argv.includes("--tracked-only");
const args = ["ls-files", "-z", "--cached"];
if (!indexedOnly) args.push("--others", "--exclude-standard");
const files = [...new Set(execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }).split("\0").filter(Boolean))]
  .filter((name) => fs.existsSync(path.join(root, name)));
const problems = [];
const forbiddenDirectory = /(^|\/)(node_modules|\.next|\.expo|\.gradle|\.kotlin|\.cxx|__pycache__|artifacts|output|tmp|private-signing|private-config)(\/|$)|^apps\/mobile\/android\/(?:app\/)?build\//;
const credential = /github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|vcp_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\\nA-Za-z0-9+/=]{100,}/;

for (const name of files) {
  if (forbiddenDirectory.test(name) || /\.(apk|aab|apks|ipa|log|tsbuildinfo|pyc)$/i.test(name))
    problems.push(`${name}: generated output belongs outside source control`);
  const basename = path.posix.basename(name);
  if ((/^\.env(?:\.|$)/.test(basename) && basename !== ".env.example") ||
      (/\.(jks|keystore|pem|p12|p8)$/i.test(name) && name !== "apps/mobile/android/app/debug.keystore") ||
      /service[-_]?account.*\.json$/i.test(basename))
    problems.push(`${name}: private configuration belongs outside source control`);
  if (/\.(?:[cm]?[jt]sx?|json|md|txt|ya?ml|html|css|xml|properties|gradle|kt|py|sh|ps1|example)$/.test(name)) {
    const content = fs.readFileSync(path.join(root, name), "utf8");
    if (credential.test(content)) problems.push(`${name}: possible private credential`);
  }
}

const app = JSON.parse(fs.readFileSync(path.join(root, "apps/mobile/app.json"), "utf8")).expo;
const gradle = fs.readFileSync(path.join(root, "apps/mobile/android/app/build.gradle"), "utf8");
if (Number(gradle.match(/\bversionCode\s+(\d+)/)?.[1]) !== app.android.versionCode ||
    gradle.match(/\bversionName\s+"([^"]+)"/)?.[1] !== app.version)
  problems.push("Android and Expo release versions disagree");

// Expo regenerates these files. Compare their contents so native-only edits cannot disappear.
const templates = "apps/mobile/plugins/android-launch/";
const native = "apps/mobile/android/app/src/main/";
const copies = [
  ...["NourishLaunchScreen.kt", "NourishLaunchScreenPackage.kt", "NourishLogoView.kt"].map((name) => [name, "java/com/nourishspoon/app/" + name]),
  ["nourish_jar_wordmark.json", "res/raw/nourish_jar_wordmark.json"],
  ["nourish_logo_strokes.json", "res/raw/nourish_logo_strokes.json"],
  ["nourish_launch_logo_vector.xml", "res/drawable/nourish_launch_logo_vector.xml"],
];
for (const [source, destination] of copies) {
  const original = fs.readFileSync(path.join(root, templates, source));
  const generated = fs.readFileSync(path.join(root, native, destination));
  // Git and Windows may use different text line endings.
  if (original.toString().replaceAll("\r\n", "\n") !== generated.toString().replaceAll("\r\n", "\n"))
    problems.push(`${native + destination}: differs from its Expo plugin template`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else console.log(`Repository audit passed: ${files.length} source files; no installers, generated output or detected private credentials; native templates and versions agree.`);
