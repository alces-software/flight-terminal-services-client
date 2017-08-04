import clusterSpecs from '../modules/clusterSpecs';
import tokens from '../modules/tokens';

export default {
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [tokens.constants.NAME]: tokens.reducer,
};
