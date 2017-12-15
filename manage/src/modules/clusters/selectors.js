/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates, selectorUtils } from 'flight-reactware';

import { NAME } from './constants';

const clustersState = state => state[NAME];

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export function hostname(state) {
  return clustersState(state).data.hostname;
}

function hostnameFromPropsOrStore(state, props) {
  return props.hostname || hostname(state);
}

const hostnameIndex = selectorUtils.buildIndexSelector(NAME, 'hostname');

// Returns the retrieval for the JSONAPI resource obtained from the Flight
// Launch server.
const jsonApiRetrieval = createSelector(
  jsonApiState,
  hostnameFromPropsOrStore,

  loadingStates.selectors.retrieval,
);

// Returns the retrieval for the cluster attributes obtained from the running
// cluster itself.
const clusterRetrieval = createSelector(
  clustersState,
  hostnameFromPropsOrStore,

  loadingStates.selectors.retrieval,
);

export const retrieval = createSelector(
  clusterRetrieval,
  jsonApiRetrieval,

  (cr, jar) => {
    const initiated = cr.initiated || jar.initiated;
    const resolved = cr.resolved && jar.resolved;
    const rejected = cr.rejected || jar.rejected;
    const pending = initiated && ! resolved && ! rejected;

    return {
      initiated,
      pending,
      resolved,
      rejected,
    };
  },
);

export const relationshipRetrieval = relationName => createSelector(
  jsonApiState,
  hostnameFromPropsOrStore,
  () => relationName,

  loadingStates.selectors.relationshipRetrieval,
);

export const currentCluster = createSelector(
  jsonApiData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);
