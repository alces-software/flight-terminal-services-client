/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED } from './actionTypes';
// import api from '../../modules/api';

function loading(ipAddress) {
  return {
    type: LOADING,
    payload: {
      ipAddress,
    },
    meta: {
      loadingState: {
        key: ipAddress,
      }
    }
  };
}

function loaded(cluster) {
  return {
    type: LOADED,
    payload: cluster,
    meta: {
      loadingState: {
        key: cluster.attributes.ipAddress,
      }
    }
  };
}

// function failedToLoad(error, ipAddress) {
//   return {
//     type: FAILED,
//     error: true,
//     payload: {
//       error,
//     },
//     meta: {
//       loadingState: {
//         key: ipAddress,
//       },
//     },
//   };
// }

const fakeCluster = {
  id: 'd229b332-062e-4d91-b378-ea203f5a004c',
  type: 'clusters',
  attributes: {
    browseConfigsUrl: 'https://solemnly-red-sloth-249e10c0.cloud.alces.network/vpn/downloads/',
    hasVpn: true,
    hostname: 'solemnly-red-sloth-249e10c0.cloud.alces.network',
    imgDir: 'https://solemnly-red-sloth-249e10c0.cloud.alces.network/vpn/img/',
    ipAddress: '52.48.157.53',
    vpnConfigs: [
      {
        url: 'https://solemnly-red-sloth-249e10c0.cloud.alces.network/vpn/downloads/clusterware-openvpn.tar.gz',
        os: 'linux',
      },
      {
        url: 'https://solemnly-red-sloth-249e10c0.cloud.alces.network/vpn/downloads/clusterware-openvpn.zip',
        os: 'windows',
      },
      {
        url: 'https://solemnly-red-sloth-249e10c0.cloud.alces.network/vpn/downloads/clusterware-tunnelblick.zip',
        os: 'macos',
      },
    ],
  },
};

export function loadCluster(ipAddress) {
  return (dispatch) => {
    dispatch(loading(ipAddress));
    setTimeout(() => { dispatch(loaded(fakeCluster)); }, 1000);

    // const baseTenantUrl = '/api/v1/tenants';
    // return api.actions.fetchOneByLookupKey(baseTenantUrl, 'identifier', identifier)
    //   .then(entity => dispatch(loaded(entity)))
    //   .catch(error => Promise.reject(dispatch(failedToLoad(error, identifier))));
  };
}
