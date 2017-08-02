/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import loadingStates from '../../modules/loadingStates';
import composeReducers from '../../reducers/composeReducers';

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


export default composeReducers(
  loadingStates.reducer({
    pending: LOADING,
    resolved: LOADED,
    rejected: LOAD_FAILED,
  }),
  reducer,
);
