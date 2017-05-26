/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADED } from './actionTypes';

const initialState = {
  tokens: {},
};

function addEntity(state, tenant) {
  return {
    ...state,
    tokens: {
      ...state.tokens,
      [tenant.id]: tenant
    }
  }
}

export default function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADED:
      return addEntity(state, payload);

    default:
      return state;
  }
}
