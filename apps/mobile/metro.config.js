const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '../../packages')];

config.resolver.extraNodeModules = {
  '@packages/types': path.resolve(__dirname, '../../packages/types'),
  '@packages/utils': path.resolve(__dirname, '../../packages/utils'),
  '@packages/catalog': path.resolve(__dirname, '../../packages/catalog'),
};

module.exports = config;
