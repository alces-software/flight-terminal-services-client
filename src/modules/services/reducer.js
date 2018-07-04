import { combineReducers } from 'redux';
import { apiRequest, loadingStates } from 'flight-reactware';

import {
  LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
} from './actionTypes';

const initialState = {
  flightDirectoryConfig: null,
  site: null,
};

// A reducer to maintain the siteId.
function siteIdReducer(state = null, { meta, payload, type }) {
  switch (type) {
    case LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED:
      return meta.siteId == null ? null : meta.siteId;

    default:
      return state;
  }
}

const metaReducers = combineReducers({
  siteId: siteIdReducer,
  [loadingStates.constants.NAME]: loadingStates.reducer({
    pending: LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED,
    resolved: apiRequest.resolved(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED),
    rejected: apiRequest.rejected(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED),
  }),
});

function dataReducer(state=initialState, action) {
  switch (action.type) {
    case apiRequest.resolved(LOAD_TERMINAL_SERVICES_CONFIG_REQUESTED):
      const data = action.payload.data;
      return {
        flightDirectoryConfig: data.flight_directory_config,
        site: data.site,
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
