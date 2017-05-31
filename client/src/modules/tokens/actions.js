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

import { LOADING, LOADED, LOAD_FAILED } from './actionTypes';

function loading(name) {
  return {
    type: LOADING,
    meta: {
      loadingState: {
        key: name,
      }
    }
  }
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
  }
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

function fetchOneByLookupKey(baseUrl, key, value) {
  const url = new URL(baseUrl);
  url.searchParams.append(`filter[${key}]`, value);

  return fetch(url.href)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(j => Promise.reject(j));
      }
    })
    .then((jsonApiDoc) => {
      const entities = jsonApiDoc.data;
      if (entities.length < 1 || entities > 1) {
        return Promise.reject({
          errors: [{
            status: 404,
            title: 'Record not found',
            code: 'RECORD_NOT_FOUND',
          }]
        });
      }
      return entities[0];
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== 'test') {
        console.log('fetchOneByLookupKey failed:', error);  // eslint-disable-line no-console
      }
      return Promise.reject(error);
    });
}

export function loadToken(name) {
  return (dispatch, getState) => {
    invariant(name, 'Token name must be given');

    dispatch(loading(name));

    const tenant = tenants.selectors.tenant(getState());
    const baseTokensUrl = tenant.relationships.tokens.links.related;

    return fetchOneByLookupKey(baseTokensUrl, 'name', name)
      .then(entity => dispatch(loaded(entity)))
      .catch(error => dispatch(failedToLoad(error, name)));
  };
}
