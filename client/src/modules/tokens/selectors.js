/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import find from 'lodash/find';

import loadingStates from '../../modules/loadingStates';

import { NAME } from './constants';

const tokenState = state => state[NAME];
const allTokens = state => state[NAME].data.tokens;
const tokenNameProp = (state, props) => props.tokenName;

export const tokenFromName = createSelector(
  allTokens,
  tokenNameProp,

  (tokens, tokenName) => (
    find(tokens, token => token.attributes.name === tokenName)
  ),
);

export const isLoading = createSelector(
  tokenState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.isPending(ts, tokenName),
);

export const hasLoaded = createSelector(
  tokenState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.isResolved(ts, tokenName),
);
