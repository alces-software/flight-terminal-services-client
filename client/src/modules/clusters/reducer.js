/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

import loadingStates from '../../modules/loadingStates';

import { LOADING, LOADED, FAILED } from './actionTypes';

// hostname or IP address is to be provided by the user. All other values are
// to be retrieved from an API server running on flight compute.
//
// `flavour` could be used to determine various items of blurb.
// `hasVpn` will determine whether we show the VPN section
// `hasTutorials` will determine whether we show the tutorials section
// `hasWebTerminal` will determine whether we show a "standard login
// terminal".
//
// Current mechanism for downloading VPN config files can be kept.
const initialState = {
};

function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADED:
      return {
        ...state,
        [payload.attributes.hostname]: payload,
      };

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
      rejected: FAILED,
    }),
  }),
});
