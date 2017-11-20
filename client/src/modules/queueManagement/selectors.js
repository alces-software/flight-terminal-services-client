/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import clusters from '../../modules/clusters';

import { NAME } from './constants';

const stateSlice = state => state[NAME];

export function showingModal(state) {
  return stateSlice(state).showingModal;
}

export function queueSpec(state) {
  return stateSlice(state).queueSpec;
}

export function queueAction(state) {
  return stateSlice(state).action;
}

export const retrieval = clusters.selectors.relationshipRetrieval('computeQueueActions');
