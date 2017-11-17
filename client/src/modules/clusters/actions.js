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
      hostname: hostname,
    },
  };
}

// Load the cluster resource from the Flight Launch server.
function loadClusterResource(clusterId, hostname) {
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { hostname });
    if (!initiated || rejected) {
      const resource = {
        type: 'clusters',
        id: clusterId,
        links: {
          self: `/api/v1/clusters/${clusterId}`,
        },
        meta: {
          loadingStates: {
            key: clusterId
          }
        }
      };
      const action = jsonApi.actions.loadResource(resource);
      return dispatch(action);
      // return dispatchFakeActions(dispatch, hostname, resource);
    }
  };
}

export function loadCluster(hostname) {
  return (dispatch, getState) => {
    dispatch(loadAttributesFromRunningCluster(hostname))
      .then((resp) => {
        const clusterId = resp.payload.data.data.id;
        return dispatch(loadClusterResource(clusterId));
      });
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
