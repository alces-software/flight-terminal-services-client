require('ignore-styles');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

require('babel-register')({
  ignore: function(filename) {
    if ( filename.match(/\/(build|node_modules)\//) ) {
      return true;
    } else {
      return false;
    }
  },
  presets: ['es2015', 'react-app']
});

// routes
const index = require('./routes/index');
const { default: api } = require('./routes/api');
const universalLoader = require('./universal');

const app = express();

// Support Gzip
app.use(compression());

// Suport post requests with body data (doesn't support multipart, use multer)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup logger
app.use(morgan('combined'));

app.use('/', index);

// Redirect requests to admin and token generator apps to the launch-api
// server.
//
// Those apps are served directly from the launch-api server at present, but
// that could change in the future so we use a 302 redirect.
app.use(new RegExp('/(alces/)?admin'), (req, res) => {
  const newHost = req.hostname.replace(/^launch/, 'launch-api');
  res.redirect(302, `//${newHost}${req.originalUrl}`);
});

// Serve static assets
app.use(express.static(path.resolve(process.env.APPROOT, 'build')));
app.use('/static', express.static(path.resolve(process.env.APPROOT, 'build')));
app.use('/api', api);

// Always return the main index.html, so react-router render the route in the client
// XXX Why do we have this in addition to the above app.use('/', index)?  It
// looks like index will call universalLoader anyway.
app.use('/', universalLoader);

// XXX - Error handling?

module.exports = app;
