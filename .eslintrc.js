module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'padded-blocks': 'off',
    'no-use-before-define': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
  },
  ignorePatterns: [
    '**/node_modules',
    'src/reportWebVitals.ts',
  ],
};
