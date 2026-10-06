// expo-font is ESM-only; logic tests only need its hook signature.
module.exports = {
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: async () => undefined,
};
