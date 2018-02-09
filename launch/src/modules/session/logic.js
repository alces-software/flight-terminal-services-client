/*=============================================================================
 * Copyright (C) 2017-2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Business logic handling sessions.

import { auth } from 'flight-reactware';

import launchUsers from '../../modules/launchUsers';
import anvilUsers from '../../modules/anvilUsers';

let alcesUserLoaded = false;
function loadAlcesUserOnInitialization(dispatch) {
  if (!alcesUserLoaded) {
    alcesUserLoaded = true;
    const promise = dispatch(anvilUsers.actions.loadUser('alces'));
    if (promise) { promise.catch(e => e); }
  }
}

let previousCurrentUser;
function loadUsersWhenAuthChanges(dispatch, getState) {
  const currentUser = auth.selectors.currentUserSelector(getState());
  if (currentUser !== previousCurrentUser) {
    previousCurrentUser = currentUser;
    if (currentUser != null) {
      let promise = dispatch(launchUsers.actions.loadUser(currentUser.username));
      if (promise) { promise.catch(e => e); }
      promise = dispatch(anvilUsers.actions.loadUser(currentUser.username));
      if (promise) { promise.catch(e => e); }
    }
  }
};

export default [
  loadAlcesUserOnInitialization,
  loadUsersWhenAuthChanges,
];
