/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';

const initialState = {
  error: undefined,
  loading: true,
  identifier: undefined,
  tenant: undefined,
};

export default function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADING:
      return {
        ...state,
        error: false,
        loading: true,
        identifier: payload.identifier,
      };

    case LOADED:
      return {
        ...state,
        tenant: payload.tenant,
        error: false,
        loading: false,
      };

    case FAILED:
      return {
        ...state,
        tenant: undefined,
        error: payload.error,
        loading: false,
      };

    default:
      return state;
  }
}
