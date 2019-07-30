const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  // appHtml: resolveApp('config/webpack.config.js/template.html'),
  serverBuild: resolveApp('build/server'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  srcServer: resolveApp('server'),
  // types: resolveApp('node_modules/@types'),
  // i18n: resolveApp('src/shared/i18n'),
  publicPath: '/static/',
};

paths.resolveModules = [
  paths.srcServer,
  paths.src,
  'node_modules',
];

module.exports = paths;
