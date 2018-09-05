import { auth } from 'flight-reactware';

import {
  EXPLICIT_SITE_REQUESTED,
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
  SERVICE_TYPE,
} from './actionTypes';
import { retrieval } from './selectors';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

export function fetchTerminalServicesConfig(siteId, serviceType) {
  return (dispatch, getState) => {
    const ssoUser = auth.selectors.currentUserSelector(getState());
    if (ssoUser == null) { return; }

    const { initiated, rejected } = retrieval(getState());
    if (!initiated || rejected) {
      let url;
      if (siteId == null) {
        url = `${centerBaseUrl}/terminal_services?service_type=${serviceType}`;
      } else {
        url = `${centerBaseUrl}/sites/${siteId}/terminal_services?service_type=${serviceType}`;
      }
      const action = {
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
      return dispatch(action);
    }
  };
}

export function explicitSiteRequested(siteId) {
  return {
    type: EXPLICIT_SITE_REQUESTED,
    payload: siteId,
  };
}

export function setServiceType(serviceType) {
  return {
    type: SERVICE_TYPE,
    payload: serviceType,
  };
}
