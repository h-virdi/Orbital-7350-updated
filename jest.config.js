// module.exports = {
//   preset: 'react-native',
//   setupFilesAfterEnv: [
//     '@testing-library/jest-native/extend-expect',
//     './jest.setup.js'
//   ],
//   transformIgnorePatterns: [
//     'node_modules/(?!(@react-native|react-native|@react-navigation)/)'
//   ],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1'
//   }
// };
const path = require('path');

module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@unimodules|@react-navigation)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
