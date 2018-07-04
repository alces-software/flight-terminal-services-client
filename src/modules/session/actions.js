import {
  LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED,
} from './actionTypes';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

export function fetchFlightDirectoryConfig(siteId) {
  let url;
  if (siteId == null) {
    url = `${centerBaseUrl}/flight_directory_config`;
  } else {
    url = `${centerBaseUrl}/sites/${siteId}/flight_directory_config`;
  }
  return {
    type: LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          url: url,
          withCredentials: true,
        },
      },
      loadingState: {
        key: 'singleton',
      },
      siteId: siteId,
    },
  };
}
