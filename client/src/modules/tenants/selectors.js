/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';

import loadingStates from '../../modules/loadingStates';

import { NAME } from './constants';

const tenantState = state => state[NAME];

export function identifier(state) {
  return tenantState(state).data.identifier;
}

export function tenant(state) {
  return tenantState(state).data.tenant;
}

export const retrieval = createSelector(
  tenantState,
  identifier,

  (ts, tenantIdentifier) => ({
    initiated: loadingStates.selectors.isInitiated(ts, tenantIdentifier), 
    pending: loadingStates.selectors.isPending(ts, tenantIdentifier),
    resolved: loadingStates.selectors.isResolved(ts, tenantIdentifier),
    rejected: loadingStates.selectors.isRejected(ts, tenantIdentifier),
  }),
);

export const clusterSpecsUrlConfig = createSelector(
  tenant,

  (tenant) => {
    if (tenant == null) { return undefined; }
    return tenant.attributes.clusterSpecsUrlConfig;
  },
);
