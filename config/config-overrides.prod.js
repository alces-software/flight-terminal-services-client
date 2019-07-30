const path = require('path');

function resolveNodeModules(pkg) {
  return path.resolve(path.join(__dirname, '../node_modules/' + pkg));
}

module.exports = function(config) {
  // Make CRA's "catchall" loader ignore .md files
  // XXX Do we still want this?  If so how do we add it back?
  // config.module.rules[1].exclude.push(/\.md$/);

  // Avoids loading multiple copies of React
  config.resolve.alias.react = resolveNodeModules('react');
  config.resolve.alias['react-dom'] = resolveNodeModules('react-dom');
  // Avoids loading multiple copies of redux-form
  config.resolve.alias['redux-form'] = resolveNodeModules('redux-form');
  // Avoids loading multiple copies of styled-components
  config.resolve.alias['styled-components'] = resolveNodeModules("styled-components");

  return config;
};

