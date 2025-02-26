module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: [ "node_modules", "src" ],
  moduleNameMapper: {
    "@src(.*)": ["<rootDir>/src/$1"],
    "@app(.*)": ["<rootDir>/src/app/$1"],
    "@components(.*)": ["<rootDir>/src/app/shared/components/$1"],
    "@services(.*)": ["<rootDir>/src/app/services/$1"],
    "@pages(.*)": ["<rootDir>/src/app/pages/$1"],
    "@models(.*)": ["<rootDir>/src/app/shared/models/$1"],
    "@environments(.*)": ["<rootDir>/src/environments/$1"],
    "@tables(.*)": ["<rootDir>/src/app/tables$1"],
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  }
};
