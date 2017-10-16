/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates, selectorUtils } from 'flight-reactware';

import { NAME } from './constants';

const tenantState = state => state[NAME];

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export function identifier(state) {
  return tenantState(state).identifier;
}

export const tenant = createSelector(
  jsonApiData,
  selectorUtils.buildIndexSelector(NAME, 'identifier'),
  identifier,

  selectorUtils.resourceFromIndex,
);

export const retrieval = createSelector(
  jsonApiState,
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
