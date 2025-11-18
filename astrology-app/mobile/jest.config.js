module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/react-native/jest/.*',
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
