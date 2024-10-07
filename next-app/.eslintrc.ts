module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'next/core-web-vitals',
    // '@nuxtjs/eslint-config-typescript',
    // 'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  rules: {
    'react/display-name': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  }
}
