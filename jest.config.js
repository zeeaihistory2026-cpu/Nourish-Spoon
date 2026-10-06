// Unit tests cover pure business logic (cart math, validation, formatting),
// so they run on a plain Node environment with ts-jest — no native toolchain needed.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  setupFiles: ['./jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
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
          types: ['jest', 'node'],
        },
      },
    ],
  },
};
