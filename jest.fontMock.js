// @expo-google-fonts/* are ESM-only asset modules; logic tests only need the
// named font exports to exist.
module.exports = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return {};
      return `test-font-${String(prop)}`;
    },
  },
);
