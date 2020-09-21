module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
    './src/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'even', 'hover', 'focus'],
    translate: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true
  }
}
