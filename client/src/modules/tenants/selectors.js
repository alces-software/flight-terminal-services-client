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

const tenantEntitiesState = (state) => {
  if (state.entities[NAME] == null) { return {}; }
  return state.entities[NAME];
};

const tenantEntitiesData = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].data == null) { return {}; }
  return state.entities[NAME].data;
};

const identifierIndex = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].index == null) { return {}; }
  if (state.entities[NAME].index.identifier == null) { return {}; }
  return state.entities[NAME].index.identifier;
};

export function identifier(state) {
  return tenantState(state).identifier;
}

export const tenant = createSelector(
  identifier,
  identifierIndex,
  tenantEntitiesData,

  (identifier, index, tenantsById) => {
    const tenantId = index[identifier];
    return tenantsById[tenantId];
  },
);

export const retrieval = createSelector(
  tenantEntitiesState,
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
