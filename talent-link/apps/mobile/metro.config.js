const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = {
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
  },
  watchFolders: [path.join(__dirname, '..', '..')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
