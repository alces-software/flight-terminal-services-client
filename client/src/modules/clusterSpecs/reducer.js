/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import loadingStates from '../../modules/loadingStates';
import composeReducers from '../../reducers/composeReducers';

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

export default composeReducers(
  loadingStates.reducer({
    pending: LOADING,
    resolved: LOADED,
    rejected: FAILED,
  }),
  urlReducer,
  specsReducer,
);
