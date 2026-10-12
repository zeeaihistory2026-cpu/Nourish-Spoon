const { withAppBuildGradle, withProjectBuildGradle } = require("expo/config-plugins");

// Keep private keys outside android/, which Expo may recreate during prebuild.
module.exports = function withReleaseSigning(config) {
  config = withAppBuildGradle(config, mod => {
    let source = mod.modResults.contents;
    if (!source.includes("def releaseSigning =")) {
      source = source.replace("android {", `def releaseSigning = new Properties()
def releaseSigningFile = rootProject.file('../private-signing/signing.properties')
if (releaseSigningFile.exists()) releaseSigningFile.withInputStream { releaseSigning.load(it) }

android {`);
      source = source.replace("signingConfigs {", `signingConfigs {
        if (releaseSigningFile.exists()) {
            release {
                storeFile rootProject.file(releaseSigning['storeFile'])
                storePassword releaseSigning['storePassword']
                keyAlias releaseSigning['keyAlias']
                keyPassword releaseSigning['keyPassword']
            }
        }`);
      source = source.replace(/(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/, "$1signingConfig releaseSigningFile.exists() ? signingConfigs.release : signingConfigs.debug");
    }
    if (!source.includes('enableV1Signing = true')) {
      source = source.replace("keyPassword releaseSigning['keyPassword']", "keyPassword releaseSigning['keyPassword']\n                enableV1Signing = true\n                enableV2Signing = true\n                enableV3Signing = true");
    }
    if (!source.includes("Missing Nourish Spoon release signing")) source += `
gradle.taskGraph.whenReady { graph ->
    if (!releaseSigningFile.exists() && graph.allTasks.any { it.path == ':app:assembleRelease' || it.path == ':app:bundleRelease' }) {
        throw new GradleException('Missing Nourish Spoon release signing: restore private-signing/signing.properties and its keystore before distribution.')
    }
}
`;
    mod.modResults.contents = source;
    return mod;
  });
  return withProjectBuildGradle(config, mod => {
    if (!mod.modResults.contents.includes("def requestedNdkVersion")) {
      mod.modResults.contents = mod.modResults.contents.replace('apply plugin: "com.facebook.react.rootproject"', `def requestedNdkVersion = findProperty('nourish.ndkVersion') ?: System.getenv('NOURISH_NDK_VERSION')
if (requestedNdkVersion) ext.ndkVersion = requestedNdkVersion

apply plugin: "com.facebook.react.rootproject"`);
    }
    return mod;
  });
};
