const fs = require("node:fs");
const path = require("node:path");
const { withDangerousMod } = require("expo/config-plugins");

/** Firebase's native SDK reads client resources; this contains no server credential. */
function installFirebaseMessaging(projectRoot) {
  const file = path.join(projectRoot, "private-config/google-services.json");
  if (!fs.existsSync(file)) throw Error("Provide private-config/google-services.json for this Firebase Android app.");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  const client = config.client.find((item) => item.client_info.android_client_info?.package_name === "com.nourishspoon.app");
  if (!client) throw Error("Firebase client configuration does not match the Android package.");
  const values = {
    google_app_id: client.client_info.mobilesdk_app_id,
    google_api_key: client.api_key[0].current_key,
    gcm_defaultSenderId: config.project_info.project_number,
    project_id: config.project_info.project_id,
    google_storage_bucket: config.project_info.storage_bucket,
  };
  const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const destination = path.join(projectRoot, "android/app/src/main/res/values/nourish_firebase.xml");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, '<resources>' + Object.entries(values).filter(([, value]) => value).map(([name, value]) => `<string name="${name}" translatable="false">${escape(value)}</string>`).join("") + '</resources>');
}
module.exports = (config) => withDangerousMod(config, ["android", (mod) => { installFirebaseMessaging(mod.modRequest.projectRoot); return mod; }]);
module.exports.installFirebaseMessaging = installFirebaseMessaging;
if (require.main === module) installFirebaseMessaging(path.resolve(__dirname, ".."));
