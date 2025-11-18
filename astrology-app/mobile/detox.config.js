module.exports = {
  testRunner: 'jest',
  runnerConfig: 'jest-e2e.json',
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'artifacts/build/AstrologyApp.app',
      build: 'xcodebuild -workspace ios/AstrologyApp.xcworkspace -scheme AstrologyApp -configuration Release -derivedDataPath artifacts/build -arch x86_64 -sdk iphonesimulator -UseNewBuildSystem=NO'
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: {
        type: 'iPhone 15 Pro',
      },
      app: 'ios',
    },
    'ios.sim.release': {
      device: {
        type: 'iPhone 15 Pro',
      },
      app: 'ios',
    },
  },
  testRunner: 'jest',
};
