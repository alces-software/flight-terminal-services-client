/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';
import api from '../../modules/api';

function loading(identifier) {
  return {
    type: LOADING,
    payload: {
      identifier,
    },
    meta: {
      loadingState: {
        key: identifier,
      }
    }
  }
}

function loaded(tenant) {
  return {
    type: LOADED,
    payload: {
      tenant,
    },
    meta: {
      loadingState: {
        key: tenant.attributes.identifier,
      }
    }
  }
}

function failedToLoad(error, identifier) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error,
    },
    meta: {
      loadingState: {
        key: identifier,
      },
    },
  };
}

export function loadTenant(identifier) {
  return (dispatch) => {
    if (identifier == null) { identifier = 'default'; }

    dispatch(loading(identifier));

    const baseTenantUrl = '/api/v1/tenants';
    return api.actions.fetchOneByLookupKey(baseTenantUrl, 'identifier', identifier)
      .then(entity => dispatch(loaded(entity)))
      .catch(error => Promise.reject(dispatch(failedToLoad(error, identifier))));
  };
}
