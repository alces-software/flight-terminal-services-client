/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { auth, loadingStates, selectorUtils } from 'flight-reactware';

import { RESOURCE_NAME } from './constants';

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(RESOURCE_NAME);

export const retrieval = createSelector(
  jsonApiState,
  (state, props) => props.user,

  loadingStates.selectors.retrieval,
);

const userFromName = createSelector(
  jsonApiData,
  selectorUtils.buildIndexSelector(RESOURCE_NAME, 'name'),
  (state, props) => props.username,

  selectorUtils.resourceFromIndex,
);

export function alcesUser(state) {
  return userFromName(state, { username: 'alces' });
}

export const currentUser = createSelector(
  state => state,
  auth.selectors.currentUserSelector,

  (state, user) => {
    if (user == null) {
      return undefined;
    }
    return userFromName(state, { username: user.username });
  }
);
