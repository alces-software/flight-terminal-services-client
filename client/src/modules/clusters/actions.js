/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { LOAD_CLUSTER_REQUESTED } from './actionTypes';
import { retrieval } from './selectors';

// Load the cluster attributes defined on the running cluster.
function loadAttributesFromRunningCluster(hostname) {
  return {
    type: LOAD_CLUSTER_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          url: `https://${hostname}/www/index.json`,
        },
        skipAuthHeader: true,
      },
      loadingState: {
        key: hostname,
      },
      hostname: hostname,
    },
  };
}

// Load the cluster resource from the Flight Launch server.
function loadClusterResource(clusterId, hostname) {
  const resource = {
    type: 'clusters',
    id: clusterId,
    links: {
      self: `/api/v1/clusters/${clusterId}`,
    },
    meta: {
      loadingStates: {
        key: hostname
      }
    }
  };
  return jsonApi.actions.loadResource(resource);
}

export function loadCluster(hostname) {
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { hostname });
    if (!initiated || rejected) {
      dispatch(loadAttributesFromRunningCluster(hostname))
        .then((resp) => {
          const clusterId = resp.payload.data.data.id;
          return dispatch(loadClusterResource(clusterId, hostname));
        })
        .catch(e => e);
    };
  };
}
