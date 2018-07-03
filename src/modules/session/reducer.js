import { apiRequest } from 'flight-reactware';

import {
  LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED,
} from './actionTypes';

const initialState = {
  flightDirectoryConfig: null,
  site: null,
};

function reducer(state=initialState, action) {
  switch (action.type) {
    case apiRequest.resolved(LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED):
      const data = action.payload.data;
      return {
        flightDirectoryConfig: data.flight_directory_config,
        site: data.site,
      };

    case apiRequest.rejected(LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED):
      return initialState;

    default:
      return state;
  }
}

export default reducer;
