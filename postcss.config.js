module.exports = {
  plugins: [
    require('postcss-import')(),
    // has-pseudo-class: the css-has-pseudo polyfill rewrites :has() into an escaped
    // attribute selector that Sass (run again by the Angular build) can't parse.
    // :has() is natively supported in all current browsers, so the polyfill isn't needed.
    require('postcss-preset-env')({ features: { 'has-pseudo-class': false } })
  ]
};
