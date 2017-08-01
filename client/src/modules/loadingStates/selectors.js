/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PENDING, RESOLVED, REJECTED } from './constants';

export const loadingStateForKey = (state, key) => state.meta.loadingState[key];

export const isPending = (state, key) =>
  loadingStateForKey(state, key) === PENDING;

export const isResolved = (state, key) =>
  loadingStateForKey(state, key) === RESOLVED;

export const isRejected = (state, key) =>
  loadingStateForKey(state, key) === REJECTED;

export const isInitiated = (state, key) =>
  isPending(state, key) || isResolved(state, key) || isRejected(state, key);
