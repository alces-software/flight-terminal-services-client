/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

import loadingStates from '../../modules/loadingStates';
import { addReducers } from '../../reducers/utils';

import { LOADING, LOADED, FAILED } from './actionTypes';

const initialState = {
  identifier: undefined,
  tenant: undefined,
};

function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADING:
      return {
        ...state,
        identifier: payload.identifier,
      };

    case LOADED:
      return {
        ...state,
        tenant: payload.tenant,
      };

    case FAILED:
      return {
        ...state,
        tenant: undefined,
      };

    default:
      return state;
  }
}

const metaReducers = combineReducers({
  loadingStates: loadingStates.reducer({
    pending: LOADING,
    resolved: LOADED,
    rejected: FAILED,
  }),
});

export default addReducers(reducer, {
  meta: metaReducers,
});
