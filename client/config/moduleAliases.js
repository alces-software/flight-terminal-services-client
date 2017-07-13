var path = require('path');
var fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  // In the development environment we want to build and bundle flight-common
  // from a local directory.  The following resolveAlias configurations allow
  // that.
  //
  // We also need to make sure that the src files are processed by babel.
  // Which is done by configuring the APP_SRC_PATH environment variable to
  // point to the flight-common src directory.
  //
  // This could be replaced with https://github.com/thebeansgroup/webpack-link
  // perhaps that would be the better option.
  'flight-common/lib': resolveApp('../../flight-common/src'),
  'flight-common': resolveApp('../../flight-common'),
  react: resolveApp('./node_modules/react'),
  'react-dom': resolveApp('./node_modules/react-dom'),
}
