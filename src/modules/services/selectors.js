import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const servicesState = state => state[NAME];
const servicesData = state => servicesState(state).data;
const servicesMeta = state => servicesState(state).meta;

export function siteId(state) {
  return servicesMeta(state).siteId;
}

export function site(state) {
  return servicesData(state).site;
}

export const retrieval = createSelector(
  servicesState,
  () => 'singleton',

  loadingStates.selectors.retrieval,
);
