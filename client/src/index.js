import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { renderRoutes } from 'react-router-config';

import { Analytics } from 'flight-reactware';

import middleware from './middleware';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes';

import './index.css';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const history = createHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    form: formReducer,
  }),
  preloadedState,
  composeEnhancers(
    applyMiddleware(
      ...middleware,
      routerMiddleware(history)
    )
  )
);

Analytics.initialize(process.env.REACT_APP_ANALYTICS_TRACKER_ID, history);

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      {renderRoutes(routes)}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
