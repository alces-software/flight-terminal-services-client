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

const tokenEntitiesState = (state) => {
  if (state.entities[NAME] == null) { return {}; }
  return state.entities[NAME];
};

const tokenEntitiesData = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].data == null) { return {}; }
  return state.entities[NAME].data;
};

const nameIndex = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].index == null) { return {}; }
  if (state.entities[NAME].index.name == null) { return {}; }
  return state.entities[NAME].index.name;
};

const tokenNameProp = (state, props) => props.tokenName;

export const tokenFromName = createSelector(
  nameIndex,
  tokenEntitiesData,
  tokenNameProp,

  (index, tokensById, tokenName) => {
    const tenantId = index[tokenName];
    return tokensById[tenantId];
  },
);

export const isLoading = createSelector(
  tokenEntitiesState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.isPending(ts, tokenName),
);

export const hasLoaded = createSelector(
  tokenEntitiesState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.isResolved(ts, tokenName),
);
