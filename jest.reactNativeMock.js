// Minimal react-native stub for logic tests: components are imported only for
// their pure helpers (e.g. statusLabel), never rendered.
const handler = {
  get(target, prop) {
    if (prop === 'StyleSheet') {
      return { create: (styles) => styles, flatten: (style) => style, compose: (a, b) => [a, b] };
    }
    if (prop === 'Platform') {
      return { OS: 'ios', select: (options) => options.ios ?? options.native ?? options.default };
    }
    if (prop === '__esModule') return true;
    if (typeof prop === 'string') {
      const component = () => null;
      component.displayName = prop;
      return component;
    }
    return undefined;
  },
};

module.exports = new Proxy({}, handler);
