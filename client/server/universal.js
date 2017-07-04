const path = require('path')
const fs = require('fs')

const React = require('react')
const {Provider} = require('react-redux')
const {createStore, combineReducers} = require('redux')
const {renderToString} = require('react-dom/server')
const {StaticRouter} = require('react-router-dom')
const {Route} = require('react-router');
const {CSSTransitionGroup} = require('react-transition-group')
const {ServerStyleSheet, StyleSheetManager} = require('styled-components')
//const {default: configureStore} = require('../src/store')
//const {default: App} = require('../src/containers/App')

const {Page} = require('flight-reactware')
const {default: SitePage} = require('../src/components/Page')
const {default: pages, getPage} = require ('../src/pages')
const {default: reducers} = require('../src/reducers')

module.exports = function universalLoader(req, res) {
  const location = {pathname: req.url};
  const page = getPage(location);
  if (!page) {
    res.status(404).send('Not found');
    return;
  }

  const sheet = new ServerStyleSheet()
  const filePath = path.resolve(process.env.APPROOT, 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData)=>{
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const context = {}
    const store = createStore(combineReducers(reducers));
    const renderPage = () => (
      <SitePage title={page.title}>
        <Route component={page.component} />
      </SitePage>
    );
    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <Provider store={store}>
          <StaticRouter
            location={location}
            context={context}
          >
            <Page site="Flight">
              <Route render={renderPage} />
            </Page>
          </StaticRouter>
        </Provider>
      </StyleSheetManager>
    )

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      redirect(301, context.url)
    } else {
      // we're good, send the response
      const RenderedApp = htmlData
            .replace('<div id="root">', '<div id="root">' + markup)
            .replace('</head>', sheet.getStyleTags() + '</head>')
      res.send(RenderedApp)
    }
  })
}
