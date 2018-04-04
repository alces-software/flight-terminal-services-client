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

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

const tokenNameProp = (state, props) => props.tokenName;

export const tokenFromName = createSelector(
  jsonApiData,
  selectorUtils.buildIndexSelector(NAME, 'name'),
  tokenNameProp,

  selectorUtils.resourceFromIndex,
);

export const isLoading = createSelector(
  jsonApiState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.retrieval(ts, tokenName).pending,
);

export const hasLoaded = createSelector(
  jsonApiState,
  tokenNameProp,

  (ts, tokenName) => loadingStates.selectors.retrieval(ts, tokenName).resolved,
);
