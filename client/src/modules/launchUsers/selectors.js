/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { auth, loadingStates, selectorUtils } from 'flight-reactware';

import { NAME } from './constants';

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export const retrieval = createSelector(
  jsonApiState,
  (state, props) => props.username,

  loadingStates.selectors.retrieval,
);

const userFromUsername = createSelector(
  jsonApiData,
  selectorUtils.buildIndexSelector(NAME, 'username'),
  (state, props) => props.username,

  selectorUtils.resourceFromIndex,
);

export const currentUser = createSelector(
  state => state,
  auth.selectors.currentUserSelector,

  (state, user) => {
    if (user == null) {
      return undefined;
    }
    return userFromUsername(state, { username: user.username });
  }
);
