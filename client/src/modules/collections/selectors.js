/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates } from 'flight-reactware';

import users from '../../modules/users';

import { NAME } from './constants';

const collectionsEntitiesState = state => {
  if (state.entities[NAME] == null) { return {}; }
  return state.entities[NAME];
};

const collectionEntitiesData = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].data == null) { return {}; }
  return state.entities[NAME].data;
};

function collectionsForUser(user, allCollections) {
  if (user == null) {
    return [];
  }
  if (user.relationships.collections.data == null) {
    return [];
  }
  const linkageData = user.relationships.collections.data;
  return linkageData.reduce((accum, linkageDatum) => {
    accum.push(allCollections[linkageDatum.id]);
    return accum;
  }, []);
}

export const retrieval = createSelector(
  collectionsEntitiesState,
  (state, props) => props.username,

  loadingStates.selectors.retrieval,
);

export const availableCollections = createSelector(
  users.selectors.currentUser,
  users.selectors.alcesUser,
  collectionEntitiesData,

  (currentUser, alcesUser, collections) => {
    let userCols;
    if (currentUser === alcesUser) {
      userCols = [];
    } else {
      userCols = collectionsForUser(currentUser, collections);
    }
    const alcesCols = collectionsForUser(alcesUser, collections);
    return [ ...userCols, ...alcesCols ];
  },
);
