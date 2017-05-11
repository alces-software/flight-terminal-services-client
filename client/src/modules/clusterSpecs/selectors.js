/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { NAME } from './constants';

export function getAll(state) {
  const clusterSpecsState = state[NAME];
  return {
    ...clusterSpecsState,
    clusterSpecs: clusterSpecsState.specs,
    clusterSpecsFile: clusterSpecsState.file,
  }
}
