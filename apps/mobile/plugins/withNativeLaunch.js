const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("expo/config-plugins");

function installNativeLaunch(projectRoot) {
  const android = path.join(projectRoot, "android/app/src/main");
  const templates = path.join(__dirname, "android-launch");
  const java = path.join(android, "java/com/nourishspoon/app");
  const resource = (folder) => {
    const target = path.join(android, "res", folder);
    fs.mkdirSync(target, { recursive: true });
    return target;
  };
  for (const name of [
    "NourishLaunchScreen.kt",
    "NourishLaunchScreenPackage.kt",
  ])
    fs.copyFileSync(path.join(templates, name), path.join(java, name));
  fs.copyFileSync(
    path.join(templates, "nourish_launch_screen.xml"),
    path.join(resource("layout"), "nourish_launch_screen.xml"),
  );
  fs.copyFileSync(
    path.join(templates, "nourish_launch_icon.xml"),
    path.join(resource("drawable"), "nourish_launch_icon.xml"),
  );
  fs.copyFileSync(
    path.join(templates, "nourish_starting_window.xml"),
    path.join(resource("drawable"), "nourish_starting_window.xml"),
  );
  for (const name of ["ic_launcher.xml", "ic_launcher_round.xml"]) {
    const icon = path.join(resource("mipmap-anydpi-v26"), name);
    if (fs.existsSync(icon))
      fs.writeFileSync(
        icon,
        fs
          .readFileSync(icon, "utf8")
          .replace(
            "@mipmap/ic_launcher_foreground",
            "@drawable/nourish_launch_icon",
          ),
      );
    // Android 7 uses these complete-mark icons; newer launchers use the adaptive resources above.
    fs.writeFileSync(
      path.join(resource("mipmap-anydpi"), name),
      '<inset xmlns:android="http://schemas.android.com/apk/res/android" android:drawable="@drawable/nourish_launch_icon" />',
    );
  }
  fs.copyFileSync(
    path.join(projectRoot, "assets/website/logo-transparent.png"),
    path.join(resource("drawable-nodpi"), "nourish_launch_logo.png"),
  );
  const base = `<resources><style name="Theme.Nourish.Launch" parent="AppTheme"><item name="android:windowBackground">@drawable/nourish_starting_window</item><item name="android:statusBarColor">#FDF6E3</item><item name="android:navigationBarColor">#FDF6E3</item><item name="android:windowLightStatusBar">true</item><item name="android:windowLightNavigationBar">true</item></style></resources>`;
  fs.writeFileSync(
    path.join(resource("values"), "nourish_launch_styles.xml"),
    base,
  );
  fs.writeFileSync(
    path.join(resource("values-v31"), "nourish_launch_styles.xml"),
    base.replace(
      "</style>",
      `<item name="android:windowSplashScreenBackground">#FDF6E3</item><item name="android:windowSplashScreenAnimatedIcon">@drawable/nourish_launch_icon</item><item name="android:windowSplashScreenIconBackgroundColor">#FDF6E3</item></style>`,
    ),
  );
  const activity = path.join(java, "MainActivity.kt");
  let source = fs.readFileSync(activity, "utf8");
  if (!source.includes("NourishLaunchScreen.show(this)"))
    source = source.replace(
      "super.onCreate(null)",
      "super.onCreate(null)\n    NourishLaunchScreen.show(this)",
    );
  fs.writeFileSync(activity, source);
  const application = path.join(java, "MainApplication.kt");
  source = fs.readFileSync(application, "utf8");
  if (!source.includes("add(NourishLaunchScreenPackage())"))
    source = source.replace(
      "PackageList(this).packages.apply {",
      "PackageList(this).packages.apply {\n          add(NourishLaunchScreenPackage())",
    );
  fs.writeFileSync(application, source);
  const manifest = path.join(android, "AndroidManifest.xml");
  source = fs
    .readFileSync(manifest, "utf8")
    .replace(
      /(<activity\b[^>]*android:name="\.MainActivity"[^>]*android:theme=")[^"]+/,
      "$1@style/Theme.Nourish.Launch",
    );
  source = source
    .replace(
      /\s*<uses-permission android:name="android.permission.(?:READ_EXTERNAL_STORAGE|WRITE_EXTERNAL_STORAGE|SYSTEM_ALERT_WINDOW)"[^>]*\/>/g,
      "",
    )
    .replace('android:allowBackup="true"', 'android:allowBackup="false"');
  if (!source.includes("xmlns:tools="))
    source = source.replace(
      "<manifest ",
      '<manifest xmlns:tools="http://schemas.android.com/tools" ',
    );
  // Library manifests can reintroduce permissions, so explicitly remove them during manifest merging.
  source = source.replace(
    "<application ",
    '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" tools:node="remove" />\n  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" tools:node="remove" />\n  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" tools:node="remove" />\n  <application ',
  );
  fs.writeFileSync(manifest, source);
}

module.exports = (config) =>
  withDangerousMod(config, [
    "android",
    async (mod) => {
      installNativeLaunch(mod.modRequest.projectRoot);
      return mod;
    },
  ]);
module.exports.installNativeLaunch = installNativeLaunch;
