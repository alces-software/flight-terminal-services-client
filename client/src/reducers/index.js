import { compose } from 'redux';
import {
  createReducers as createFlightReducers,
  jsonApi,
  loadingStates,
} from 'flight-reactware';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import anvilUsers from '../modules/anvilUsers';
import clusterSpecs from '../modules/clusterSpecs';
import clusters from '../modules/clusters';
import launchUsers from '../modules/launchUsers';
import tenants from '../modules/tenants';
import tokens from '../modules/tokens';

const entityIndexes = [
  ...anvilUsers.indexes || [],
  ...clusters.indexes || [],
  ...launchUsers.indexes || [],
  ...tenants.indexes || [],
  ...tokens.indexes || [],
];

const loadingStatesConfig = [
  anvilUsers.loadingStatesConfig || {},
  clusters.loadingStatesConfig || {},
  launchUsers.loadingStatesConfig || {},
  tenants.loadingStatesConfig || {},
  tokens.loadingStatesConfig || {},
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
