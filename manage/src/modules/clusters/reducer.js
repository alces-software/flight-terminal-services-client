/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';
import { apiRequest, loadingStates, modals } from 'flight-reactware';

import {
  LOAD_CLUSTER_REQUESTED,
  TUTORIAL_ACCESS_PERMITTED,
  MODAL_SHOWN,
  MODAL_HIDDEN,
} from './actionTypes';

// A reducer to maintain the hostname for the current cluster being stewarded.
function hostnameReducer(state = null, { meta, type }) {
  switch (type) {
    case LOAD_CLUSTER_REQUESTED:
      return meta.hostname;

    default:
      return state;
  }
}

// A simplified version of the withIndexes higher order reducer.
//
// The `withIndexes` higher order reducer cannot be used here as it is too
// tightly coupled to flight-reactware's jsonApi module.  See comments in
// `withIndexes` module.
function indexReducer(state = {}, { type, payload }) {
  switch (type) {
    case apiRequest.resolved(LOAD_CLUSTER_REQUESTED):
      const jsonApiDoc = payload.data.data;
      return {
        hostname: {
          ...state.hostname || {},
          [jsonApiDoc.attributes.hostname]: jsonApiDoc.id,
        }
      };

    default:
      return state;
  }
}

const metaReducers = combineReducers({
  hostname: hostnameReducer,
  [loadingStates.constants.NAME]: loadingStates.reducer({
    pending: LOAD_CLUSTER_REQUESTED,
    resolved: apiRequest.resolved(LOAD_CLUSTER_REQUESTED),
    rejected: apiRequest.rejected(LOAD_CLUSTER_REQUESTED),
  }),
  tutorialAccessPermitted: (state=false, { type }) => (
    type === TUTORIAL_ACCESS_PERMITTED ? true : state
  ),
  terminationModal: modals.createModalReducer(MODAL_SHOWN, MODAL_HIDDEN),
});

function dataReducer(state = {}, { type, payload }) {
  switch (type) {
    case apiRequest.resolved(LOAD_CLUSTER_REQUESTED):
      const jsonApiDoc = payload.data.data;
      return {
        ...state,
        [jsonApiDoc.id]: jsonApiDoc,
      };

    default:
      return state;
  }
}

export default combineReducers({
  data: dataReducer,
  meta: metaReducers,
  index: indexReducer,
});
