/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { NAME } from './constants';

const stateSlice = state => state[NAME];

export function showingModal(state) {
  return stateSlice(state).showingModal;
}

export function queueDescriptor(state) {
  return stateSlice(state).queueDescriptor;
}

export function queueAction(state) {
  return stateSlice(state).action;
}
