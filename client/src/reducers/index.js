import clusterSpecs from '../modules/clusterSpecs';
import clusters from '../modules/clusters';
import tenants from '../modules/tenants';
import tokens from '../modules/tokens';

export default {
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [clusters.constants.NAME]: clusters.reducer,
  [tenants.constants.NAME]: tenants.reducer,
  [tokens.constants.NAME]: tokens.reducer,
};
