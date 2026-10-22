const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

function fixture(run) {
  const temporaryRoot = fs.realpathSync(os.tmpdir());
  const directory = fs.mkdtempSync(path.join(temporaryRoot, "nourish-repository-check-"));
  function write(name, value) {
    const file = path.join(directory, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
  }
  const git = (...args) => execFileSync("git", args, { cwd: directory, stdio: "ignore" });
  try {
    git("init", "--quiet");
    write("scripts/audit-repository.mjs", fs.readFileSync(path.resolve("scripts/audit-repository.mjs")));
    write(".gitignore", "*.apk\n.env*\n");
    write("apps/mobile/app.json", JSON.stringify({ expo: { version: "1.0.0", android: { versionCode: 29 } } }));
    write("apps/mobile/android/app/build.gradle", 'versionCode 29\nversionName "1.0.0"\n');
    for (const [source, destination] of [
      ...["NourishLaunchScreen.kt", "NourishLaunchScreenPackage.kt", "NourishLogoView.kt"].map(name => [name, "java/com/nourishspoon/app/" + name]),
      ["nourish_jar_wordmark.json", "res/raw/nourish_jar_wordmark.json"],
      ["nourish_logo_strokes.json", "res/raw/nourish_logo_strokes.json"],
      ["nourish_launch_logo_vector.xml", "res/drawable/nourish_launch_logo_vector.xml"],
    ]) {
      write("apps/mobile/plugins/android-launch/" + source, "fixture\n");
      write("apps/mobile/android/app/src/main/" + destination, "fixture\n");
    }
    git("add", "--all");
    const check = () => spawnSync(process.execPath, ["scripts/audit-repository.mjs", "--tracked-only"], { cwd: directory, encoding: "utf8" });
    run({ write, git, check });
  } finally {
    const relative = path.relative(temporaryRoot, directory);
    assert.ok(!relative.startsWith("..") && !path.isAbsolute(relative) && relative.startsWith("nourish-repository-check-"));
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("repository checks accept source with matching native templates and versions", () => fixture(({ check }) => {
  const result = check();
  assert.equal(result.status, 0, result.stderr);
}));

test("repository checks reject a force-added APK even when Git ignores installers", () => fixture(({ write, git, check }) => {
  write("obsolete.apk", "not an installer");
  git("add", "--force", "obsolete.apk");
  const result = check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /obsolete\.apk: generated output/);
}));

test("repository checks reject leaked token-shaped credentials in a text document", () => fixture(({ write, git, check }) => {
  write("accidental-credential.txt", "github_pat_" + "q".repeat(80));
  git("add", "accidental-credential.txt");
  const result = check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /possible private credential/);
}));

test("repository checks reject Expo/native version drift", () => fixture(({ write, git, check }) => {
  write("apps/mobile/android/app/build.gradle", 'versionCode 28\nversionName "1.0.0"\n');
  git("add", "--all");
  const result = check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /release versions disagree/);
}));
