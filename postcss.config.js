module.exports = {
  // plugins: {
  //   tailwindcss: {},
  //   autoprefixer: {}
  // }
  plugins: [
    require('tailwindcss/nesting')(require('postcss-nesting')),
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-import')
  ]
}
