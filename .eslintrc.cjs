module.exports = {
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended'],

  rules: {
    // override/add rules settings here, such as:
    'no-undef': 0,
    'no-unused-vars': 1,
    'vue/max-attributes-per-line': 0,
    'vue/html-self-closing': 0,
    'vue/no-mutating-props': 0,
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/attribute-hyphenation': 0,
  },
}
