/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^expo-localization$': '<rootDir>/tests/__mocks__/expo-localization.js',
  },
}
