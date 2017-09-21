/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

const initialState = {
  hostname: undefined,
};

export default function reducer(state = initialState, { meta, type }) {
  if (
    type === jsonApi.actionTypes.RESOURCE_REQUESTED &&
    meta.entity.type === 'clusters'
  ) {
    return {
      ...state,
      hostname: meta.entity.meta.loadingStates.key,
    };
  }
  return state;
}

