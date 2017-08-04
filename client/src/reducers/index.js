import clusterSpecs from '../modules/clusterSpecs';
import tokens from '../modules/tokens';
import tenants from '../modules/tenants';

export default {
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [tokens.constants.NAME]: tokens.reducer,
  [tenants.constants.NAME]: tenants.reducer,
};
