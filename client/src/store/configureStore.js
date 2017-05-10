/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createStore, compose } from 'redux';

import rootReducer from '../reducers';
import enhanceWithMiddleware from '../middleware';
import { loadState } from '../utils/persistence';

const storeEnhancers = [
  enhanceWithMiddleware,
  window.devToolsExtension ? window.devToolsExtension() : f => f,
];

const storeEnhancer = compose(...storeEnhancers);

export default function configureStore() {
  const initialState = loadState();
  const store = createStore(rootReducer, initialState, storeEnhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
