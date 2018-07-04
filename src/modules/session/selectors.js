import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const sessionState = state => state[NAME];
const sessionData = state => sessionState(state).data;
const sessionMeta = state => sessionState(state).meta;

export function siteId(state) {
  return sessionMeta(state).siteId;
}

export function site(state) {
  return sessionData(state).site;
}

export const retrieval = createSelector(
  sessionState,
  () => 'singleton',

  loadingStates.selectors.retrieval,
);
