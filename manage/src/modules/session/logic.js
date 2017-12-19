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

let previousCurrentUser;
function loadUsersWhenAuthChanges(dispatch, getState) {
  const currentUser = auth.selectors.currentUserSelector(getState());
  if (currentUser !== previousCurrentUser) {
    previousCurrentUser = currentUser;
    if (currentUser != null) {
      dispatch(launchUsers.actions.loadUser(currentUser.username))
        .catch(e => e);
    }
  }
};

export default [
  loadUsersWhenAuthChanges,
];
