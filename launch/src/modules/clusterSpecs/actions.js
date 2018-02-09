import { LOADING, LOADED, FAILED } from './actionTypes';
import tenants from '../../modules/tenants';
import { clusterSpecsFile } from './selectors';

let devClusterSpecs;
if (process.env.NODE_ENV === 'development') {
  devClusterSpecs = require('./data/clusterSpecs.example.json');
}

function buildClusterSpecsConfig(fileOverride, { defaultFile, defaultUrl, prefix }) {
  if (fileOverride != null && !fileOverride.endsWith('.json')) {
    fileOverride = `${fileOverride}.json`;
  }
  return {
    url: fileOverride ? `${prefix}${fileOverride}` : defaultUrl,
    file: fileOverride ? fileOverride : defaultFile,
  };
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
  };
}

function loading(specsConfig) {
  return {
    type: LOADING,
    payload: specsConfig,
    meta: {
      loadingState: {
        key: specsConfig.url,
      }
    }
  };
}

function loaded(specs, specsConfig) {
  return {
    type: LOADED,
    payload: {
      specs,
    },
    meta: {
      loadingState: {
        key: specsConfig.url,
      }
    }
  };
}

function failedToLoad(error, specsConfig) {
  return {
    type: FAILED,
    error: true,
    payload: {
      error,
    },
    meta: {
      loadingState: {
        key: specsConfig.url,
      }
    }
  };
}

function loadSpecs(specsConfig) {
  return fetch(specsConfig.url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(j => Promise.reject(j));
      }
    });
}

function determineSpecsFileOverride(specsFileOverride, getState) {
  // If the redux store contains a specs file override we continue to use it.
  // Otherwise, we can end up showing a different set of cluster specs when
  // navigating between tabs.
  const storedSpecsFile = clusterSpecsFile(getState());
  if (storedSpecsFile != null) {
    return storedSpecsFile;
  }
  return specsFileOverride;
}

export function loadClusterSpecs(specsFileOverride) {
  return (dispatch, getState) => {
    specsFileOverride = determineSpecsFileOverride(specsFileOverride, getState);
    if (process.env.NODE_ENV === 'test') {
      return setDevSpecs();
    } else if (process.env.NODE_ENV === 'development' && specsFileOverride === 'dev') {
      return setDevSpecs();
    } else {
      const specsConfig = buildClusterSpecsConfig(
        specsFileOverride,
        tenants.selectors.clusterSpecsUrlConfig(getState())
      );

      dispatch(loading(specsConfig));
      loadSpecs(specsConfig)
        .then(specs => dispatch(loaded(specs, specsConfig)))
        .catch(error => dispatch(failedToLoad(error, specsConfig)));
    }
  };
}
