/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { auth, loadingStates } from 'flight-reactware';

import { NAME } from './constants';

const userEntitiesState = state => {
  if (state.entities[NAME] == null) { return {}; }
  return state.entities[NAME];
};

const userEntitiesData = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].data == null) { return {}; }
  return state.entities[NAME].data;
};

const usernameIndex = state => {
  if (state.entities[NAME] == null) { return {}; }
  if (state.entities[NAME].index == null) { return {}; }
  if (state.entities[NAME].index.name == null) { return {}; }
  return state.entities[NAME].index.name;
};

export const retrieval = createSelector(
  userEntitiesState,
  (state, props) => props.user,

  loadingStates.selectors.retrieval,
);

const userFromName = createSelector(
  userEntitiesData,
  usernameIndex,
  (state, props) => props.username,

  (entitiesById, index, key) => {
    const id = index[key];
    return entitiesById[id];
  },
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
