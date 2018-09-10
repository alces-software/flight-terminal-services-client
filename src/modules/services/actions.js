import { auth } from 'flight-reactware';

import {
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
  SET_SCOPE,
} from './actionTypes';
import { retrieval } from './selectors';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

function buildUrl(scopeType, scopeId, serviceType) {
  let prefix;
  if (scopeType != null) {
    prefix = `${centerBaseUrl}/${scopeType}/${scopeId}`;
  } else {
    prefix = `${centerBaseUrl}`;
  }
  return `${prefix}/terminal_services?service_type=${serviceType}`;
}

export function fetchTerminalServicesConfig(scopeType, scopeId, serviceType) {
  return (dispatch, getState) => {
    const ssoUser = auth.selectors.currentUserSelector(getState());
    if (ssoUser == null) { return; }

    const { initiated, rejected } = retrieval(getState());
    if (!initiated || rejected) {
      const url = buildUrl(scopeType, scopeId, serviceType);
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
          scope: {
            type: scopeType,
            id: scopeId,
            serviceType: serviceType,
          }
        },
      };
      return dispatch(action);
    }
  };
}

export function setScope(scopeType, scopeId, serviceType) {
  return {
    type: SET_SCOPE,
    payload: {
      type: scopeType,
      id: scopeId,
      serviceType,
    },
  };
}
