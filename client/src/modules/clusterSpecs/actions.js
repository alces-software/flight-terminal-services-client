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
  devClusterSpecs = require('../../data/clusterSpecs.dev.json');
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

function loadingClusterSpecs(specsUrl) {
  return {
    type: LOADING,
    payload: {
      ...specsUrl,
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
    dispatch(loadingClusterSpecs(specsUrl));
    fetch(specsUrl.url)
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

export function loadClusterSpecs(specsUrl) {
    if (process.env.NODE_ENV === 'test') {
      return setDevSpecs();
    } else if (process.env.NODE_ENV === 'development' && specsFile === 'dev') {
      return setDevSpecs();
    } else {
      return loadSpecs(specsUrl);
    }
}
