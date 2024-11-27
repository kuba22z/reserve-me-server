import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '(.spec|.e2e-spec).ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  setupFiles: ['<rootDir>auto-mock-config.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}

export default config
