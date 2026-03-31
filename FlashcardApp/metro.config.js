// metro.config.js
// NativeWind v4 requires wrapping the metro config with withNativeWind
// so it can process global.css through the Tailwind CSS pipeline.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  // Point to the global CSS entry that contains @tailwind directives
  input: './global.css',
});
