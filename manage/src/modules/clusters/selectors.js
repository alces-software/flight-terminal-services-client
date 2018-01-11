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
const clustersData = state => clustersState(state).data;

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export function hostname(state) {
  return clustersState(state).meta.hostname;
}

function hostnameFromPropsOrStore(state, props) {
  return props.hostname || hostname(state);
}

const hostnameIndex = selectorUtils.buildIndexSelector(
  NAME,
  'hostname',
  clustersState,
);

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

// Selects the retrieval state for the current cluster.
//
// The details for the cluster can come from two distinct locations: the
// cluster itself and the Flight Launch server.  The details from the Flight
// Launch server are optional. If they cannot be retrieved, that should not be
// considered a failure to retrive the cluster's details.
export const retrieval = createSelector(
  clusterRetrieval,
  jsonApiRetrieval,

  (cr, jar) => {
    const initiated = cr.initiated || jar.initiated;
    const resolved = cr.resolved && ( jar.initiated && !jar.pending );
    const rejected = cr.rejected;
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

// Selects the details the Flight Launch server maintains (if any) about the
// current cluster.
const launchCluster = createSelector(
  jsonApiData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);

// Selects the details the cluster provides about itself.
const runningCluster = createSelector(
  clustersData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);

export const currentCluster = createSelector(
  launchCluster,
  runningCluster,

  (lc, rc) => {
    if (lc == null && rc == null) {
      return undefined;
    } else if (lc == null || rc == null) {
      return lc || rc;
    } else {
      return {
        ...lc,
        attributes: {
          ...lc.attributes,
          ...rc.attributes,
        }
      };
    }
  },
);
