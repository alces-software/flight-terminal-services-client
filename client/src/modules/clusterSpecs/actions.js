/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';
import tenants from '../../modules/tenants';

let devClusterSpecs;
if (process.env.NODE_ENV === 'development') {
  devClusterSpecs = require('./data/clusterSpecs.dev.json');
}

function buildClusterSpecsConfig(fileOverride, { defaultFile, defaultUrl, prefix }) {
  return {
    url: fileOverride ? `${prefix}${fileOverride}` : defaultUrl,
    file: fileOverride ? fileOverride : defaultFile,
  }
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

function loading(specsConfig) {
  return {
    type: LOADING,
    payload: specsConfig,
  }
}

function loaded(specs) {
  return {
    type: LOADED,
    payload: {
      specs,
    }
  }
}

function failedToLoad(error) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error: error,
    },
  };
}

function loadSpecs(specsConfig) {
  return (dispatch) => {
    fetch(specsConfig.url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject('Unable to load');
        }
      })
      .then((specs) => {
        return dispatch(loaded(specs));
      })
      .catch((error) => {
        console.log('error:', error);  // eslint-disable-line no-console
        return dispatch(failedToLoad(error));
      });
  };
}

export function loadClusterSpecs(specsFileOverride) {
    if (process.env.NODE_ENV === 'test') {
      return setDevSpecs();
    } else if (process.env.NODE_ENV === 'development' && specsFileOverride === 'dev') {
      return setDevSpecs();
    } else {
      return (dispatch, getState) => {
        const specsConfig = buildClusterSpecsConfig(
          specsFileOverride,
          tenants.selectors.clusterSpecsUrlConfig(getState())
        );
        dispatch(loading(specsConfig));
        dispatch(loadSpecs(specsConfig));
      }
    }
}
