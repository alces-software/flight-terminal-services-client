/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';

import { NAME } from './constants';

export function identifier(state) {
  return state[NAME].identifier;
}

export function tenant(state) {
  return state[NAME].tenant;
}

export function retrieval(state) {
  const s = state[NAME];
  return {
    error: s.error,
    loading: s.loading,
  };
}

export const clusterSpecsUrlConfig = createSelector(
  tenant,

  (tenant) => {
    if (tenant == null) { return undefined; }
    return tenant.attributes.clusterSpecsUrlConfig;
  },
);
