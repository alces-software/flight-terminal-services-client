import { LOADING, LOADED, FAILED } from './actionTypes';
// import tenants from '../../modules/tenants';

let devClusterSpecs;
if (process.env.NODE_ENV === 'development') {
  devClusterSpecs = require('./data/clusterSpecs.dev.json');
}

function buildClusterSpecsConfig(fileOverride, { defaultFile, defaultUrl, prefix }) {
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

const clusterSpecsUrlConfig = {
  defaultFile: 'default.json',
  // defaultUrl: 'https://alces-flight.s3.amazonaws.com/FlightLaunch/ClusterSpecs/default/default.json.NOPE',
  defaultUrl: 'https://alces-flight.s3.amazonaws.com/FlightLaunch/ClusterSpecs/default/default.json',
  prefix: 'https://alces-flight.s3.amazonaws.com/FlightLaunch/ClusterSpecs/default',
};

export function loadClusterSpecs(specsFileOverride) {
  if (process.env.NODE_ENV === 'test') {
    return setDevSpecs();
  } else if (process.env.NODE_ENV === 'development' && specsFileOverride === 'dev') {
    return setDevSpecs();
  } else {
    return (dispatch, getState) => {
      const specsConfig = buildClusterSpecsConfig(
        specsFileOverride,
        clusterSpecsUrlConfig,
        // tenants.selectors.clusterSpecsUrlConfig(getState())
      );

      dispatch(loading(specsConfig));
      loadSpecs(specsConfig)
        .then(specs => dispatch(loaded(specs, specsConfig)))
        .catch(error => dispatch(failedToLoad(error, specsConfig)));
    };
  }
}
