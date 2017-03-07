var aliases = {};
var path = require('path');

console.log('aliases:', aliases);  // eslint-disable-line no-console

/**
 * Will look for .scss|sass files inside the node_modules folder
 */
function npmModule(url, file, done) {
  console.log('url:', url);  // eslint-disable-line no-console
  console.log('file:', file);  // eslint-disable-line no-console
  console.log('aliases[url]:', aliases[url]);  // eslint-disable-line no-console
  // check if the path was already found and cached
  if(aliases[url]) {
    return done({ file:aliases[url] });
  }

  // look for modules installed through npm
  try {
    console.log('trying');  // eslint-disable-line no-console
    var newPath = path.relative('./css', require.resolve(url));
    console.log('newPath:', newPath);  // eslint-disable-line no-console
    aliases[url] = newPath; // cache this request
    return done({ file:newPath });
  } catch(e) {
    console.log('e:', e);  // eslint-disable-line no-console
    // if your module could not be found, just return the original url
    aliases[url] = url;
    return done({ file:url });
  }
}

module.exports = npmModule;
