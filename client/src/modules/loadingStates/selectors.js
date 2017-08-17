/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { NAME, PENDING, RESOLVED, REJECTED } from './constants';

export const loadingStateForKey = (state, key) => state.meta[NAME][key];

export const isPending = (state, key) =>
  loadingStateForKey(state, key) === PENDING;

export const isResolved = (state, key) =>
  loadingStateForKey(state, key) === RESOLVED;

export const isRejected = (state, key) =>
  loadingStateForKey(state, key) === REJECTED;

export const isInitiated = (state, key) =>
  isPending(state, key) || isResolved(state, key) || isRejected(state, key);

export const retrieval = (state, key) => ({
  initiated: isInitiated(state, key), 
  pending: isPending(state, key),
  resolved: isResolved(state, key),
  rejected: isRejected(state, key),
});
