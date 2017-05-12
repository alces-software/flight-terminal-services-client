/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';

let devClusterSpecs;
if (process.env.NODE_ENV === 'development') {
  devClusterSpecs = require('./data/clusterSpecs.dev.json');
}

function buildClusterSpecsUrl(relativePath, tenantIdentifier) {
  let tenantPath;
  if (tenantIdentifier == null) {
    tenantPath = "";
  } else {
    tenantPath = `${tenantIdentifier}/`;
  }
  const prefix = process.env.REACT_APP_CLUSTER_SPECS_URL_PREFIX;
  return `${prefix}${tenantPath}${relativePath}`;
}

function setDevSpecs() {
  return (dispatch) => {
    dispatch({
      type: LOADING,
      payload: {
        file: 'dev',
      },
    });
    setTimeout(
      () => dispatch({
        type: LOADED,
        payload: {
          specs: devClusterSpecs,
        },
      }),
      500,
    );
  }
}

function loadingClusterSpecs(specsUrl, specsFile, tenantIdentifier) {
  return {
    type: LOADING,
    payload: {
      file: specsFile,
      tenantIdentifier: tenantIdentifier,
      url: specsUrl,
    }
  }
}

function loadedClusterSpecs(specs) {
  return {
    type: LOADED,
    payload: {
      specs,
    }
  }
}

function failedToLoadClusterSpecs(error) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error: error,
    },
  };
}

function loadSpecs(specsUrl) {
  return (dispatch) => {
    fetch(specsUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ error: 'Unable to load cluster definitions' });
        }
      })
      .then((specs) => {
        return dispatch(loadedClusterSpecs(specs));
      })
      .catch((error) => {
        console.log('error:', error);  // eslint-disable-line no-console
        return dispatch(failedToLoadClusterSpecs(error));
      });
  };
}

export function loadClusterSpecs(specsFile, tenantIdentifier) {
    if (process.env.NODE_ENV === 'test') {
      return setDevSpecs();
    } else if (process.env.NODE_ENV === 'development' && specsFile === 'dev') {
      return setDevSpecs();
    } else {
      return (dispatch) => {
        const specsUrl = buildClusterSpecsUrl(specsFile, tenantIdentifier);
        dispatch(loadingClusterSpecs(specsUrl, specsFile, tenantIdentifier));
        dispatch(loadSpecs(specsUrl));
      }
    }
}
