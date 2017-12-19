import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const clusterSpecsState = state => state[NAME];

export function clusterSpecs(state) {
  return state[NAME].data.specs;
}

const specsUrl = state => state[NAME].data.url;

export function clusterSpecsFile(state) {
  return state[NAME].data.file;
}

export const retrieval = createSelector(
  clusterSpecsState,
  specsUrl,

  loadingStates.selectors.retrieval,
);
