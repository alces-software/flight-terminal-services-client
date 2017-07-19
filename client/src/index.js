import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route, withRouter } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import { reducer as formReducer } from 'redux-form';
import Helmet from 'react-helmet';

import { Analytics, Page, Scrolling } from 'flight-reactware';

import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import { getPage } from './pages';
import SitePage from './components/Page';

import './index.css';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const history = createHistory();
const middleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    form: formReducer,
  }),
  preloadedState,
  composeEnhancers(
    applyMiddleware(middleware)
  )
);

Analytics.initialize(history);

class ScrollToTopRoute extends Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.any,
  };

  componentDidMount() {
    var hash = window.location.hash;
    if (hash) {
      Scrolling.scrollTo(hash.substring(1));
    }
  }

  componentDidUpdate(prevProps) {
    if ( this.props.location.action === 'POP' ) {
      return;
    }
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
    var hash = window.location.hash;
    if (hash) {
      Scrolling.scrollTo(hash.substring(1));
    }
  }

  render() {
    return this.props.children;
  }
}
const ScrollToTop = withRouter(ScrollToTopRoute);
const productName = process.env.REACT_APP_PRODUCT_NAME;

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <ScrollToTop>
        <Page site={process.env.REACT_APP_SITE}>
          <Helmet
            defaultTitle={productName}
            titleTemplate={`${productName} - %s`}
          />
          <Route
            render={
              ({ location }) => {
                const page = getPage(location);
                return (
                  <SitePage title={page.title}>
                    <CSSTransitionGroup
                      transitionEnterTimeout={250}
                      transitionLeave={false}
                      transitionName="fade"
                    >
                      <Route
                        component={page.component}
                        key={location.key}
                      />
                    </CSSTransitionGroup>
                  </SitePage>
                );
              }
            }
          />
        </Page>
      </ScrollToTop>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
