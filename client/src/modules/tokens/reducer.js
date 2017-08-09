/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

import loadingStates from '../../modules/loadingStates';

import { LOADING, LOADED, LOAD_FAILED } from './actionTypes';

const initialState = {
  tokens: {},
};

const addEntity = tenant => state => (
  {
    ...state,
    tokens: {
      ...state.tokens,
      [tenant.id]: tenant
    }
  }
);

function reducer(state = initialState, { meta, payload, type }) {
  switch (type) {

    case LOADED:
      return addEntity(payload)(state);

    default:
      return state;
  }
}

export default combineReducers({
  data: reducer,
  meta: combineReducers({
    [loadingStates.constants.NAME]: loadingStates.reducer({
      pending: LOADING,
      resolved: LOADED,
      rejected: LOAD_FAILED,
    }),
  }),
});
