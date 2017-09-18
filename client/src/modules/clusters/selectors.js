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

function hostnameFromProps(state, props) {
  return props.hostname;
}

export const retrieval = createSelector(
  clusterEntitiesState,
  hostnameFromProps,

  loadingStates.selectors.retrieval,
);

export const fromHostname = createSelector(
  clusterEntitiesData,
  clusterHostnameIndex,
  hostnameFromProps,

  (clustersById, hostnameIndex, hostname) => {
    const clusterId = hostnameIndex[hostname];
    return clustersById[clusterId];
  }
);
