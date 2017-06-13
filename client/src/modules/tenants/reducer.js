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

export default composeReducers(
  loadingStates.reducer({
    loading: LOADING,
    resolved: LOADED,
    rejected: FAILED,
  }),
  reducer,
);
