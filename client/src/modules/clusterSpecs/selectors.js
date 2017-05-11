/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { NAME } from './constants';

export function clusterSpecs(state) {
  return state[NAME].specs;
}

export function tenantIdentifier(state) {
  return state[NAME].tenantIdentifier;
}

export function clusterSpecsFile(state) {
  return state[NAME].file;
}

export function specsAndLoading(state) {
  const s = state[NAME];
  return {
    clusterSpecs: clusterSpecs(state),
    error: s.error,
    loading: s.loading,
  };
}
