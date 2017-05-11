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
  specs: undefined,
  file: undefined,
  url: undefined,
  error: undefined,
  loading: true,
};

export default function reducer(state = initialState, { payload, type }) {
  switch (type) {

    case LOADING:
      return {
        ...state,
        file: payload.file,
        url: payload.url,
        error: false,
        loading: true,
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
