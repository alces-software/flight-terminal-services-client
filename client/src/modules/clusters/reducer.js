/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';
import { LOAD_CLUSTER_REQUESTED } from './actionTypes';

const initialState = {
  hostname: undefined,
};

export default function reducer(state = initialState, { meta, type }) {
  switch (type) {
    case LOAD_CLUSTER_REQUESTED:
      return {
        ...state,
        hostname: meta.hostname,
      };

    default:
      return state;
  }
}
