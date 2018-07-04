import {
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
} from './actionTypes';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

export function fetchTerminalServicesConfig(siteId) {
  let url;
  if (siteId == null) {
    url = `${centerBaseUrl}/terminal_services`;
  } else {
    url = `${centerBaseUrl}/sites/${siteId}/terminal_services`;
  }
  return {
    type: LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
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
