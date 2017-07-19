/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { LOADING, LOADED, FAILED } from './actionTypes';
import { processClusterSpecs } from './processClusterSpecs';

const initialState = {
  error: undefined,
  file: undefined,
  loading: true,
  specs: undefined,
  url: undefined,
};

export default function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADING:
      return {
        ...state,
        error: false,
        file: payload.file,
        loading: true,
        url: payload.url,
      };

    case LOADED:
      return {
        ...state,
        specs: processClusterSpecs(payload.specs),
        error: false,
        loading: false,
      };

    case FAILED:
      return {
        ...state,
        specs: undefined,
        error: payload.error,
        loading: false,
      };

    default:
      return state;
  }
}
