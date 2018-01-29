/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates, modals, selectorUtils } from 'flight-reactware';

import { NAME } from './constants';

const clustersState = state => state[NAME];
const clustersData = state => clustersState(state).data;
const clustersMeta = state => clustersState(state).meta;

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export function hostname(state) {
  return clustersMeta(state).hostname;
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
export const launchClusterRetrieval = createSelector(
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
  launchClusterRetrieval,

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
const launchClusterDetails = createSelector(
  jsonApiData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);

// Selects the details the cluster provides about itself.
const clusterDetails = createSelector(
  clustersData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);

export const currentCluster = createSelector(
  launchClusterDetails,
  clusterDetails,

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

export const availableAccessItems = createSelector(
  currentCluster,
  clustersMeta,

  (cluster, meta) => {
    const { hasVpn, hasWebTerminal } = cluster.attributes;
    const { isLaunchCluster } = cluster.meta || {};

    return {
      ssh: true,
      vpn: hasVpn,
      terminal: hasWebTerminal && isLaunchCluster,
      tutorials: hasWebTerminal && isLaunchCluster && meta.tutorialAccessPermitted,
    };
  },
);

export const availableManageItems = createSelector(
  currentCluster,

  (cluster) => {
    const { hasQueueManagement, hasQueueManangement } = cluster.attributes;
    const links = cluster.links || {};
    return {
      computeUnitUsage: true,
      queueManagement: hasQueueManagement || hasQueueManangement,
      terminateCluster: links.terminate,
    };
  },
);

export const isModalShowing = modals.createModalSelector(NAME, 'meta', 'terminationModal');
export const modalData = modals.createModalDataSelector(NAME, 'meta', 'terminationModal');

export const modalError = createSelector(
  modalData,

  (data) => data.error == null ? undefined : data.error,
);

const creditUsages = createSelector(
  currentCluster,
  selectorUtils.buildJsonApiResourceSelectors('creditUsages').jsonApiData,

  (cluster, creditUsagesData) => (
    selectorUtils.relatedResourcesSelector(
      cluster,
      creditUsagesData,
      'creditUsages'
    )
    .filter(cu => cu)
  ),
);

export const currentCreditConsumption = createSelector(
  creditUsages,

  (creditUsages) => {
    if (creditUsages == null || creditUsages.length < 1) {
      return undefined;
    }
    const unsorted = Object.keys(creditUsages).reduce(
      (accum, k) => { accum.push(creditUsages[k]); return accum; },
      []
    );
    const sorted = unsorted.sort((a, b) => {
      if (a.attributes.endAt == null) {
        return -1;
      }
      if (b.attributes.endAt == null) {
        return 1;
      }
      return a.attributes.endAt < b.attributes.endAt;
    });

    const mostRecent = sorted[0];
    return mostRecent.attributes.totalCuInUse;
  },
);
