/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the onboarding module.

import { auth } from 'flight-reactware';

import launchUsers from '../../modules/launchUsers';
import anvilUsers from '../../modules/anvilUsers';

let alcesUserLoaded = false;
function loadAlcesUserOnInitialization(dispatch) {
  if (!alcesUserLoaded) {
    alcesUserLoaded = true;
    // XXX catch rejected promises here or elsewhere?
    dispatch(anvilUsers.actions.loadUser('alces'));
  }
}

let previousCurrentUser;
function loadUsersWhenAuthChanges(dispatch, getState) {
  const currentUser = auth.selectors.currentUserSelector(getState());
  if (currentUser !== previousCurrentUser) {
    previousCurrentUser = currentUser;
    if (currentUser != null) {
      // XXX catch rejected promises here or elsewhere?
      dispatch(launchUsers.actions.loadUser(currentUser.username));
      // XXX catch rejected promises here or elsewhere?
      dispatch(anvilUsers.actions.loadUser(currentUser.username));
    }
  }
};

export default [
  loadAlcesUserOnInitialization,
  loadUsersWhenAuthChanges,
];
