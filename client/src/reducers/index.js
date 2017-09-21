import { compose } from 'redux';
import { jsonApi, loadingStates } from 'flight-reactware';

import clusterSpecs from '../modules/clusterSpecs';
import clusters from '../modules/clusters';
import tenants from '../modules/tenants';
import tokens from '../modules/tokens';

const entityIndexes = [
  ...clusters.indexes || [],
  ...tenants.indexes || [],
  ...tokens.indexes || [],
];

const loadingStatesConfig = [
  clusters.loadingStatesConfig || {},
  tenants.loadingStatesConfig || {},
  tokens.loadingStatesConfig || {},
];

export default {
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [clusters.constants.NAME]: clusters.reducer,
  [tenants.constants.NAME]: tenants.reducer,
  entities: compose(
    jsonApi.withIndexes(entityIndexes),
    loadingStates.withLoadingStates(loadingStatesConfig),
  )(jsonApi.reducer),
};
