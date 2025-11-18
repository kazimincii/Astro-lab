module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins: [
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ],
  };
};
