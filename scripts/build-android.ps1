param([switch]$Offline)
$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot
node (Join-Path $workspace 'apps/mobile/plugins/withFirebaseMessaging.js')
if ($LASTEXITCODE -ne 0) { throw 'Firebase Android client configuration is missing.' }
$app = Get-Content -LiteralPath (Join-Path $workspace 'apps/mobile/app.json') -Raw | ConvertFrom-Json
$release = $app.expo.version
$buildCode = $app.expo.android.versionCode
if (!$env:JAVA_HOME -or !(Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin/java.exe'))) { throw 'Set JAVA_HOME to the Android build JDK.' }
if (!$env:ANDROID_HOME) { $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android/Sdk' }
if (!(Test-Path -LiteralPath $env:ANDROID_HOME)) { throw 'Set ANDROID_HOME to the installed Android SDK.' }
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:PATH = "$env:JAVA_HOME/bin;$env:ANDROID_HOME/platform-tools;$env:PATH"
$env:NOURISH_NDK_VERSION = '28.2.13676358'
$env:NODE_ENV = 'production'
$env:EXPO_NO_DOTENV = '1'
Remove-Item Env:EXPO_PUBLIC_FIREBASE_EMULATOR_HOST,Env:FIRESTORE_EMULATOR_HOST,Env:FIREBASE_AUTH_EMULATOR_HOST -ErrorAction SilentlyContinue
Get-Content -LiteralPath (Join-Path $workspace 'apps/mobile/.env') | ForEach-Object {
  if ($_ -match '^(EXPO_PUBLIC_(?:FIREBASE|GOOGLE)_[A-Z_]+)=(.*)$') {
    if ($matches[1] -match 'EMULATOR') { throw 'Production configuration must not contain emulator settings.' }
    [Environment]::SetEnvironmentVariable($matches[1], $matches[2].Trim('"', "'"), 'Process')
  }
}
if ($env:EXPO_PUBLIC_FIREBASE_PROJECT_ID -ne 'nourish-spoon-f4820') { throw 'Wrong release database.' }
$env:EXPO_PUBLIC_COMMERCE_ENABLED = 'true'
$env:EXPO_PUBLIC_COMMERCE_API_URL = 'https://nourishspoon-dashboard.vercel.app/api/shop'
$artifacts = Join-Path $workspace 'artifacts'
New-Item -ItemType Directory -Path $artifacts -Force | Out-Null
$name = "Nourish-Spoon-v$release-build$buildCode"
$gradleArgs = @(':app:assembleRelease', ':app:lintVitalRelease', '-PreactNativeArchitectures=arm64-v8a', '-Pkotlin.compiler.execution.strategy=in-process', '-Dorg.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=1024m', '--max-workers=1', '--no-parallel', '--console=plain')
if ($Offline) { $gradleArgs += '--offline' }
Push-Location -LiteralPath (Join-Path $workspace 'apps/mobile/android')
try {
  & ./gradlew.bat @gradleArgs *> (Join-Path $artifacts "$name-build.log")
  if ($LASTEXITCODE -ne 0) { throw "Android build failed. See artifacts/$name-build.log." }
  Copy-Item -LiteralPath 'app/build/outputs/apk/release/app-release.apk' -Destination (Join-Path $artifacts "$name.apk")
} finally { Pop-Location }
Write-Output (Join-Path $artifacts "$name.apk")
