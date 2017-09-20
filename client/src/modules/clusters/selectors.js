/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';

import loadingStates from '../../modules/loadingStates';

import { NAME } from './constants';

const clustersState = state => state[NAME];

const clusterEntitiesState = state => {
  if (state.entities[NAME] == null) { return {}; }
  return state.entities[NAME];
};

const clusterEntitiesData = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].data == null) { return {}; }
  return state.entities[NAME].data;
};

const clusterHostnameIndex = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].index == null) { return {}; }
  if (state.entities[NAME].index.hostname == null) { return {}; }
  return state.entities[NAME].index.hostname;
};

export function hostname(state) {
  return clustersState(state).hostname;
}

export const retrieval = createSelector(
  clusterEntitiesState,
  hostname,

  loadingStates.selectors.retrieval,
);

export const currentCluster = createSelector(
  clusterEntitiesData,
  clusterHostnameIndex,
  hostname,

  (clustersById, hostnameIndex, hostname) => {
    const clusterId = hostnameIndex[hostname];
    return clustersById[clusterId];
  }
);
