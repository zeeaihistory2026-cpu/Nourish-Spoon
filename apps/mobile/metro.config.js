const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@packages/types': path.resolve(__dirname, 'src/packages/types'),
  '@packages/utils': path.resolve(__dirname, 'src/packages/utils'),
};

module.exports = config;
