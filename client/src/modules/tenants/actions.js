/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';

function loading(identifier) {
  return {
    type: LOADING,
    payload: {
      identifier,
    }
  }
}

function loaded(tenant) {
  return {
    type: LOADED,
    payload: {
      tenant,
    }
  }
}

function failedToLoad(error) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error,
    },
  };
}

export function loadTenant(tenantIdentifier) {
  return (dispatch) => {
    if (tenantIdentifier == null) { tenantIdentifier = 'default'; }

    dispatch(loading(tenantIdentifier));
    const tenantUrl = `/api/v1/tenants?filter[identifier]=${tenantIdentifier}`;
    return fetch(tenantUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('Unable to load');
        }
      })
      .then((tenantsJsonApiDoc) => {
        const tenants = tenantsJsonApiDoc.data;
        if (tenants.length < 1) {
          return Promise.reject('Not found');
        } else if (tenants.length > 1) {
          return Promise.reject('Multiple matches');
        }
        return dispatch(loaded(tenants[0]));
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('error:', error);  // eslint-disable-line no-console
        }
        return dispatch(failedToLoad(error));
      });
  };
}
