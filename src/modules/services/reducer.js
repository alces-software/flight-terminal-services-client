import { combineReducers } from 'redux';
import { apiRequest, loadingStates } from 'flight-reactware';

import {
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
} from './actionTypes';

const initialState = {
  site: null,
  ui: null,
};

// A reducer to maintain the scope requested.
function scopeReducer(state = null, { meta, payload, type }) {
  switch (type) {
    case LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED:
      return {
        type: meta.scope.type,
        id: meta.scope.id,
        serviceType: meta.scope.serviceType,
      };

    default:
      return state;
  }
}

function errorReducer(state = null, action) {
  switch (action.type) {
    case LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED:
    case apiRequest.resolved(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED):
      return null;

    case apiRequest.rejected(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED):
      if (action.error.response.status === 404) {
        return 'NO_TERMINAL_SERVICES';
      }
      return state;

    default:
      return state;
  }
}

const metaReducers = combineReducers({
  scope: scopeReducer,
  [loadingStates.constants.NAME]: loadingStates.reducer({
    pending: LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
    resolved: apiRequest.resolved(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED),
    rejected: apiRequest.rejected(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED),
  }),
  error: errorReducer,
});

function dataReducer(state=initialState, action) {
  switch (action.type) {
    case apiRequest.resolved(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED):
      const data = action.payload.data;
      return {
        site: data.site,
        ui: data.ui,
      };

    case apiRequest.rejected(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED):
      return initialState;

    default:
      return state;
  }
}

export default combineReducers({
  data: dataReducer,
  meta: metaReducers,
});
