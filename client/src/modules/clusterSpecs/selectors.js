import { createSelector } from 'reselect';

import loadingStates from '../../modules/loadingStates';

import { NAME } from './constants';

const clusterSpecsState = state => state[NAME];

export function clusterSpecs(state) {
  return state[NAME].specs;
}

const specsUrl = state => state[NAME].url;

// export const numClusterSpecs = createSelector(
//   clusterSpecs,

//   (specs) => specs && specs.length,
// );

// export function clusterSpecsFile(state) {
//   return state[NAME].file;
// }

export const retrieval = createSelector(
  clusterSpecsState,
  specsUrl,

  (css, url) => ({
    initiated: loadingStates.selectors.isInitiated(css, url), 
    pending: loadingStates.selectors.isPending(css, url),
    resolved: loadingStates.selectors.isResolved(css, url),
    rejected: loadingStates.selectors.isRejected(css, url),
  }),
);
