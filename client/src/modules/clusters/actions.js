/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';
import api from '../../modules/api';

function loading(hostname) {
  return {
    type: LOADING,
    payload: {
      hostname,
    },
    meta: {
      loadingState: {
        key: hostname,
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
        key: cluster.attributes.hostname,
      }
    }
  };
}

function failedToLoad(error, hostname) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error,
    },
    meta: {
      loadingState: {
        key: hostname,
      },
    },
  };
}


export function loadCluster(hostname) {
  return (dispatch) => {
    // XXX Perhaps we should take the URL instead of the hostname?
    const url = `https://${hostname}/www-api/index.json`;
    dispatch(loading(hostname));
    return api.actions.fetchOne(url)
      .then(entity => dispatch(loaded(entity)))
      .catch(error => Promise.reject(dispatch(failedToLoad(error, hostname))));
  };
}
