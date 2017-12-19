import { compose } from 'redux';
import {
  createReducers as createFlightReducers,
  jsonApi,
  loadingStates,
} from 'flight-reactware';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import * as modules from '../modules';

const entityIndexes = Object.keys(modules).reduce(
  (accum, name) => accum.concat(modules[name].indexes || []),
  [],
);

const loadingStatesConfig = Object.keys(modules).reduce(
  (accum, name) => {
    const c = modules[name].loadingStatesConfig;
    if (c) {
      accum.push(c);
    }
    return accum;
  },
  [],
);

const moduleReducers = Object.keys(modules).reduce(
  (accum, name) => {
    const m = modules[name];
    if (m.reducer) {
      accum[m.constants.NAME] = m.reducer;
    }
    return accum;
  },
  {},
);

export default (cookies) => ({
  ...createFlightReducers(cookies),
  ...moduleReducers,
  entities: compose(
    jsonApi.withIndexes(entityIndexes),
    loadingStates.withLoadingStates(loadingStatesConfig),
  )(jsonApi.reducer),
  form: formReducer,
  router: routerReducer,
});
