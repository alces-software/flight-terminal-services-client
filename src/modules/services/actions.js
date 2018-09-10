import { auth } from 'flight-reactware';

import {
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
  SET_SCOPE,
} from './actionTypes';
import { retrieval } from './selectors';

const centerBaseUrl = process.env.REACT_APP_CENTER_BASE_URL;

function buildUrl(scope, scopeId, serviceType) {
  let prefix;
  if (scope != null) {
    prefix = `${centerBaseUrl}/${scope}/${scopeId}`;
  } else {
    prefix = `${centerBaseUrl}`;
  }
  return `${prefix}/terminal_services?service_type=${serviceType}`;
}

export function fetchTerminalServicesConfig(scope, scopeId, serviceType) {
  return (dispatch, getState) => {
    const ssoUser = auth.selectors.currentUserSelector(getState());
    if (ssoUser == null) { return; }

    const { initiated, rejected } = retrieval(getState());
    if (!initiated || rejected) {
      const url = buildUrl(scope, scopeId, serviceType);
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
          scope: scope,
          scopeId: scopeId,
          serviceType: serviceType,
        },
      };
      return dispatch(action);
    }
  };
}

export function setScope(scope, scopeId, serviceType) {
  return {
    type: SET_SCOPE,
    payload: {
      scope,
      scopeId,
      serviceType,
    },
  };
}
