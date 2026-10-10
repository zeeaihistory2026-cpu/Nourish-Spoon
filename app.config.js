/**
 * Expo config for Nourish Spoon.
 *
 * google-services.json is provided via the GOOGLE_SERVICES_JSON file-type
 * EAS secret on builders; locally it falls back to the project root copy.
 */
const GOOGLE_SERVICES_JSON =
  process.env.GOOGLE_SERVICES_JSON || './google-services.json';

module.exports = {
  name: 'Nourish Spoon',
  slug: 'nourish-spoon',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'nourishspoon',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: 'com.nourishspoon.app',
    googleServicesFile: './GoogleService-Info.plist',
    supportsTablet: false,
  },
  android: {
    package: 'com.nourishspoon.app',
    googleServicesFile: GOOGLE_SERVICES_JSON,
    permissions: ['POST_NOTIFICATIONS'],
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'dbca6666-4c1c-4ec7-8c87-e9d910efc8ca',
    },
  },
  owner: 'nourishspoon2',
};
