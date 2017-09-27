/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates, selectorUtils } from 'flight-reactware';

import users from '../../modules/users';

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

export const availableCollections = createSelector(
  users.selectors.currentUser,
  users.selectors.alcesUser,
  jsonApiData,

  (currentUser, alcesUser, collections) => {
    let userCols;
    if (currentUser === alcesUser) {
      userCols = [];
    } else {
      userCols = selectorUtils.relatedResourcesSelector(
        currentUser, collections, 'collections'
      );
    }
    const alcesCols = selectorUtils.relatedResourcesSelector(
      alcesUser, collections, 'collections'
    );
    return [ ...userCols, ...alcesCols ];
  },
);
