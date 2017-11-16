/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { retrieval } from './selectors';

export function loadCluster(hostname) {
  // We need to include the type and the hostname attribute for the
  // loadingStates module.
  const resource = {
    type: 'clusters',
    links: {
      self: `https://${hostname}/www/index.json`,
    },
    meta: {
      loadingStates: {
        key: hostname,
      },
    },
  };
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { hostname });
    if (!initiated || rejected) {
      const action = jsonApi.actions.loadResource(resource);
      action.meta.apiRequest.skipAuthHeader = true;
      return dispatch(action)
        .then((resp) => {
          const clusterId = resp.payload.data.data.id;

          const action = jsonApi.actions.loadResource({
            type: 'launchClusters',
            id: clusterId,
            links: {
              self: `/api/v1/launch-clusters/${clusterId}`,
            },
            meta: {
              loadingStates: {
                key: hostname
              }
            }
          });
          return dispatch(action);
        });

      // return dispatchFakeActions(dispatch, hostname, resource);
    }
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
