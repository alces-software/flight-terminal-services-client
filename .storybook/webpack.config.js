// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://getstorybook.io/docs/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

var path = require('path');
var webpackConfigPath = path.resolve(__dirname, '../config/webpack.config.dev.js');

let config = require(webpackConfigPath);

function findUrlLoader() {
  var found;
  config.module.loaders.forEach(function(loader) {
    if (loader.loader === 'url') {
      found = loader;
    }
  });
  return found;
}

// We need to exclude the HMR modules from the URL loader.
var urlLoader = findUrlLoader();
urlLoader.exclude.push(/(webpack)-hot-middleware/);

module.exports = {
  plugins: [
    // your custom plugins
    // ...config.plugins,
  ],
  module: {
    preLoaders: [
      ...config.module.preLoaders,
    ],
    loaders: [
      // add your custom loaders.
      ...config.module.loaders,
    ],
  },
  postcss: config.postcss,
};
