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


// function dispatchFakeActions(dispatch, hostname, resource) {
//   const previousAction = {
//     type:  '@flight/jsonApi/RESOURCE_REQUESTED',
//     meta: {
//       entity: resource,
//     }
//   };
//   dispatch(previousAction);

//   return Promise.resolve(dispatch({
//     type:  '@flight/jsonApi/RESOURCE_REQUESTED_RESOLVED',
//     payload: {
//       data: {
//         data: {
//           id: 'FAKE_ID',
//           type: 'clusters',
//           attributes: {
//             clusterName: 'FAKE_CLUSTER_NAME',
//             hostname: hostname,
//             ipAddress: 'FAKE_IP_ADDRESS',
//             hasQueueManagement: true,
//             hasVpn: true,
//             vpn: {
//               browseConfigsUrl: 'FAKE_URL',
//               configFilesUrl: 'FAKE_URL',
//               configs: [
//                 { os: 'linux', url: 'FAKE_URL' },
//                 { os: 'windows', url: 'FAKE_URL' },
//                 { os: 'macos', url: 'FAKE_URL' },
//               ],
//             },
//           }
//         }
//       }
//     },
//     meta: {
//       previousAction: previousAction,
//     }
//   }));
// }
