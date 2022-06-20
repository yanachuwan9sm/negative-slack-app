module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    // TypeScriptでチェックされる項目をLintから除外する設定
    'plugin:@typescript-eslint/recommended',
    // prettierのextendsは他のextendsより後に記述する
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  root: true,
  rules: {},
};
