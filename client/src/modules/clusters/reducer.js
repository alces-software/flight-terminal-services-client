/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';
import { apiRequest, loadingStates } from 'flight-reactware';

import { LOAD_CLUSTER_REQUESTED } from './actionTypes';

const initialState = {
  data: {
    hostname: undefined,
  },
};

const metaReducers = combineReducers({
  [loadingStates.constants.NAME]: loadingStates.reducer({
    pending: LOAD_CLUSTER_REQUESTED,
    resolved: apiRequest.resolved(LOAD_CLUSTER_REQUESTED),
    rejected: apiRequest.rejected(LOAD_CLUSTER_REQUESTED),
  }),
});

function dataReducer(state = initialState, { meta, type }) {
  switch (type) {
    case LOAD_CLUSTER_REQUESTED:
      return {
        ...state,
        hostname: meta.hostname,
      };

    default:
      return state;
  }
}

export default combineReducers({
  data: dataReducer,
  meta: metaReducers,
});
