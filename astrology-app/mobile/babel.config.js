module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: ['babel-preset-expo', ...(isTest ? [] : ['nativewind/babel'])],
    plugins: [
      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ],
  };
};
