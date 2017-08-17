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

  loadingStates.selectors.retrieval,
);

export const clusterSpecsUrlConfig = createSelector(
  tenant,

  (tenant) => {
    if (tenant == null) { return undefined; }
    return tenant.attributes.clusterSpecsUrlConfig;
  },
);
