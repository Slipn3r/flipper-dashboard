/* eslint-disable */
// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // https://github.com/postcss/autoprefixer
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 10 Chrome versions',
        'last 10 Firefox versions',
        'last 4 Edge versions',
        'last 7 Safari versions',
        'last 8 Android versions',
        'last 8 ChromeAndroid versions',
        'last 8 FirefoxAndroid versions',
        'last 10 iOS versions',
        'last 5 Opera versions'
      ]
    })

    // https://github.com/elchininet/postcss-rtlcss
    // If you want to support RTL css, then
    // 1. yarn/npm install postcss-rtlcss
    // 2. optionally set quasar.config.js > framework > lang to an RTL language
    // 3. uncomment the following line:
    // require('postcss-rtlcss')
  ]
}
