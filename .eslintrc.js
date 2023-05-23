module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
  },
  globals: {
    React: 'writable',
  },
  plugins: ['react', 'react-hooks', 'simple-import-sort'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'react/jsx-boolean-value': 2,
    'react/jsx-no-target-blank': [
      2,
      {
        enforceDynamicLinks: 'always',
        warnOnSpreadAttributes: true,
      },
    ],
    'react/self-closing-comp': 2,
    'react-hooks/exhaustive-deps': 2,
    'react/jsx-no-useless-fragment': [
      2,
      {
        allowExpressions: true,
      },
    ],
    'react/jsx-curly-brace-presence': [
      2,
      {
        props: 'never',
        children: 'never',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: __dirname,
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      rules: {
        'simple-import-sort/imports': 'error',
      },
    },
    {
      "files": [
        "**/?(*.)+(spec|test).[jt]s?(x)"
      ],
      "extends": ["plugin:testing-library/react"]
    },
  ],
};
