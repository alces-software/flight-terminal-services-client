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

export function clusterSpecsFile(state) {
  return state[NAME].file;
}

export function retrieval(state) {
  const s = state[NAME];
  return {
    error: s.error,
    loading: s.loading,
  };
}
