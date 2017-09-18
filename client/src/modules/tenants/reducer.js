/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

const initialState = {
  identifier: 'default',
};

export default function reducer(state = initialState, { meta, type }) {
  if (
    type === jsonApi.actionTypes.RESOURCE_REQUESTED &&
    meta.entity.type === 'tenants'
  ) {
    return {
      ...state,
      identifier: meta.lookup.value,
    };
  }
  return state;
}
