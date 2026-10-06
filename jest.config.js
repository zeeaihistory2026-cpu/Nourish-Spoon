// Unit tests cover pure business logic (cart math, validation, formatting),
// so they run on a plain Node environment with ts-jest — no native toolchain needed.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  setupFiles: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // Brand photography is bundled via static imports; stub it out in tests.
  // react-native itself is ESM-only: stub it so logic tests can import
  // components for their pure helpers without a native toolchain.
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|svg|webp|ttf|otf)$': '<rootDir>/jest.assetMock.js',
    '^react-native$': '<rootDir>/jest.reactNativeMock.js',
    '^expo-font$': '<rootDir>/jest.expoFontMock.js',
    '^@expo-google-fonts/.*$': '<rootDir>/jest.fontMock.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: {
          module: 'commonjs',
          target: 'es2020',
          esModuleInterop: true,
          strict: true,
          jsx: 'react-jsx',
          // TS 6 requires an explicit rootDir; without it every suite fails
          // with TS5011 when ts-jest compiles files in isolation.
          rootDir: '.',
          types: ['jest', 'node'],
        },
      },
    ],
  },
};
