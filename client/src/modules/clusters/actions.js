/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';
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

function failedToLoad(error, ipAddress) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error,
    },
    meta: {
      loadingState: {
        key: ipAddress,
      },
    },
  };
}

const fakeClusterName = 'bewildered-iguana-lip-gloss';
const fakeClusterHash = '0fbaf663';
const fakeClusterHostname = `${fakeClusterName}-${fakeClusterHash}.cloud.alces.network`;

const fakeCluster = (ipAddress) => ({
  id: 'd229b332-062e-4d91-b378-ea203f5a004c',
  type: 'clusters',
  attributes: {
    browseConfigsUrl: `https://${fakeClusterHostname}/vpn/downloads/`,
    clusterName: fakeClusterName,
    hasVpn: true,
    hostname: fakeClusterHostname,
    imgDir: `https://${fakeClusterHostname}/vpn/img/`,
    ipAddress: ipAddress,
    vpnConfigFiles: `https://${fakeClusterHostname}/vpn/downloads/clusterware`,
    vpnConfigs: [
      {
        url: `https://${fakeClusterHostname}/vpn/downloads/clusterware-openvpn.tar.gz`,
        os: 'linux',
      },
      {
        url: `https://${fakeClusterHostname}/vpn/downloads/clusterware-openvpn.zip`,
        os: 'windows',
      },
      {
        url: `https://${fakeClusterHostname}/vpn/downloads/clusterware-tunnelblick.zip`,
        os: 'macos',
      },
    ],
  },
});

export function loadCluster(ipAddress) {
  return (dispatch) => {
    dispatch(loading(ipAddress));
    if (true) {
      setTimeout(() => { dispatch(loaded(fakeCluster(ipAddress))); }, 1000);
    } else {
      setTimeout(() => { dispatch(failedToLoad('fake error', ipAddress)); }, 1000);
    }

    // const baseTenantUrl = '/api/v1/tenants';
    // return api.actions.fetchOneByLookupKey(baseTenantUrl, 'identifier', identifier)
    //   .then(entity => dispatch(loaded(entity)))
    //   .catch(error => Promise.reject(dispatch(failedToLoad(error, identifier))));
  };
}
