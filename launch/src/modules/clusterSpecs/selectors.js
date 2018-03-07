import { createSelector } from 'reselect';
import { auth, loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const clusterSpecsState = state => state[NAME];
const clusterSpecsData = state => state[NAME].data;

export const clusterSpecs = createSelector(
  clusterSpecsData,
  auth.selectors.currentUserSelector,

  (data, user) => {
    if (data.specs == null) {
      return undefined;
    }
    if (user == null) {
      return data.specs.filter(s => s.availability !== 'authenticated');
    }
    return data.specs.filter(s => s.availability !== 'anonymous');
  },
);

const specsUrl = state => state[NAME].data.url;

export function clusterSpecsFile(state) {
  return state[NAME].data.file;
}

export const retrieval = createSelector(
  clusterSpecsState,
  specsUrl,

  loadingStates.selectors.retrieval,
);
