import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const sessionState = state => state[NAME];
const sessionData = state => sessionState(state).data;

export function site(state) {
  return sessionData(state).site;
}

export const retrieval = createSelector(
  sessionState,
  () => 'singleton',

  loadingStates.selectors.retrieval,
);
