import { compose } from 'redux';
import {
  createReducers as createFlightReducers,
  jsonApi,
  loadingStates,
} from 'flight-reactware';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import clusterSpecs from '../modules/clusterSpecs';
import clusters from '../modules/clusters';
import tenants from '../modules/tenants';
import tokens from '../modules/tokens';
import users from '../modules/users';

const entityIndexes = [
  ...clusters.indexes || [],
  ...tenants.indexes || [],
  ...tokens.indexes || [],
  ...users.indexes || [],
];

const loadingStatesConfig = [
  clusters.loadingStatesConfig || {},
  tenants.loadingStatesConfig || {},
  tokens.loadingStatesConfig || {},
  users.loadingStatesConfig || {},
];

export default (cookies) => ({
  ...createFlightReducers(cookies),
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [clusters.constants.NAME]: clusters.reducer,
  [tenants.constants.NAME]: tenants.reducer,
  entities: compose(
    jsonApi.withIndexes(entityIndexes),
    loadingStates.withLoadingStates(loadingStatesConfig),
  )(jsonApi.reducer),
  form: formReducer,
  router: routerReducer,
});
