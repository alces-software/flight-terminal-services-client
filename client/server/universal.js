const path = require('path');
const fs = require('fs');

const React = require('react');
const { Provider } = require('react-redux');
const { createStore, combineReducers } = require('redux');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { ServerStyleSheet, StyleSheetManager } = require('styled-components');

const { default: routes } = require('../src/routes');
const { renderRoutes } = require('react-router-config');

const { default: reducers } = require('../src/reducers');

module.exports = function universalLoader(req, res) {

  const location = { pathname: req.url };

  const sheet = new ServerStyleSheet();
  const filePath = path.resolve(process.env.APPROOT, 'build', 'index.html');

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }
    const context = {};
    const store = createStore(combineReducers(reducers));


    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <Provider store={store}>
          <StaticRouter
            context={context}
            location={location}
          >
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </StyleSheetManager>
    );

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      res.writeHead(301, {
        Location: context.url
      });
      res.end();
    } else {
      // we're good, send the response
      const RenderedApp = htmlData
            .replace('<div id="root">', '<div id="root">' + markup)
            .replace('</head>', sheet.getStyleTags() + '</head>');
      res.send(RenderedApp);
    }
  });
};
