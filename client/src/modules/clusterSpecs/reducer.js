/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';
import { loadingStates } from 'flight-reactware';

import { reduceReducers } from '../../reducers/utils';

import { LOADING, LOADED, FAILED } from './actionTypes';
import { processClusterSpecs } from './processClusterSpecs';

const initialState = {
  file: undefined,
  specs: undefined,
  url: undefined,
};

function urlReducer(state, { payload, type }) {
  if (type !== LOADING) { return state; }

  return {
    ...state,
    file: payload.file,
    url: payload.url,
  };
}

function specsReducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADED:
      return {
        ...state,
        specs: processClusterSpecs(payload.specs),
      };

    case FAILED:
      return {
        ...state,
        specs: undefined,
      };

    default:
      return state;
  }
}

const mainReducer = reduceReducers(
  urlReducer,
  specsReducer,
);

const metaReducers = combineReducers({
  [loadingStates.constants.NAME]: loadingStates.reducer({
    pending: LOADING,
    resolved: LOADED,
    rejected: FAILED,
  }),
});

export default combineReducers({
  data: mainReducer,
  meta: metaReducers,
});
