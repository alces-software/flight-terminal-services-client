/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';

import tenants from '../../modules/tenants';
import api from '../../modules/api';

import { LOADING, LOADED, LOAD_FAILED } from './actionTypes';

function loading(name) {
  return {
    type: LOADING,
    meta: {
      loadingState: {
        key: name,
      }
    }
  };
}

function loaded(token) {
  return {
    type: LOADED,
    payload: token,
    meta: {
      loadingState: {
        key: token.attributes.name,
      }
    }
  };
}

function failedToLoad(error, name) {
  let payload;
  if (isPlainObject(error)) {
    payload = error;
  } else {
    payload = {
      status: 0,
      title: error,
    };
  }

  return {
    type: LOAD_FAILED,
    error: true,
    payload,
    meta: {
      loadingState: {
        key: name,
      },
    },
  };
}

export function loadToken(name) {
  return (dispatch, getState) => {
    invariant(name, 'Token name must be given');

    dispatch(loading(name));

    const tenant = tenants.selectors.tenant(getState());
    const baseTokensUrl = tenant.relationships.tokens.links.related;
    return api.actions.fetchOneByLookupKey(baseTokensUrl, 'name', name)
      .then(entity => dispatch(loaded(entity)))
      .catch(error => Promise.reject(dispatch(failedToLoad(error, name))));
  };
}
