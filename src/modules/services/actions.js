import { auth } from 'flight-reactware';

import {
  EXPLICIT_SITE_REQUESTED,
  EXPLICIT_CLUSTER_REQUESTED,
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
  SERVICE_TYPE,
} from './actionTypes';
import { retrieval } from './selectors';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

function buildUrl(siteId, clusterId, serviceType) {
  if (clusterId != null) {
    return `${centerBaseUrl}/clusters/${clusterId}/terminal_services?service_type=${serviceType}`;
  } else if (siteId != null) {
    return `${centerBaseUrl}/sites/${siteId}/terminal_services?service_type=${serviceType}`;
  }
  return `${centerBaseUrl}/terminal_services?service_type=${serviceType}`;
}

export function fetchTerminalServicesConfig(siteId, clusterId, serviceType) {
  return (dispatch, getState) => {
    const ssoUser = auth.selectors.currentUserSelector(getState());
    if (ssoUser == null) { return; }

    const { initiated, rejected } = retrieval(getState());
    if (!initiated || rejected) {
      const url = buildUrl(siteId, clusterId, serviceType);
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
          clusterId: clusterId,
          siteId: siteId,
        },
      };
      return dispatch(action);
    }
  };
}

export function explicitClusterRequested(clusterId) {
  return {
    type: EXPLICIT_CLUSTER_REQUESTED,
    payload: clusterId,
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
