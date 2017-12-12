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
import packs from '../modules/packs';
import queueManagement from '../modules/queueManagement';
import tenants from '../modules/tenants';
import tokens from '../modules/tokens';

const entityIndexes = [
  ...anvilUsers.indexes || [],
  ...clusters.indexes || [],
  ...launchUsers.indexes || [],
  ...packs.indexes || [],
  ...queueManagement.indexes || [],
  ...tenants.indexes || [],
  ...tokens.indexes || [],
];

const loadingStatesConfig = [
  anvilUsers.loadingStatesConfig || {},
  clusters.loadingStatesConfig || {},
  launchUsers.loadingStatesConfig || {},
  packs.loadingStatesConfig || {},
  queueManagement.loadingStatesConfig || {},
  tenants.loadingStatesConfig || {},
  tokens.loadingStatesConfig || {},
];

export default (cookies) => ({
  ...createFlightReducers(cookies),
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [clusters.constants.NAME]: clusters.reducer,
  [packs.constants.NAME]: packs.reducer,
  [queueManagement.constants.NAME]: queueManagement.reducer,
  [tenants.constants.NAME]: tenants.reducer,
  entities: compose(
    jsonApi.withIndexes(entityIndexes),
    loadingStates.withLoadingStates(loadingStatesConfig),
  )(jsonApi.reducer),
  form: formReducer,
  router: routerReducer,
});
