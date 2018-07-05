/*=============================================================================
 * Copyright (C) 2017-2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Business logic handling sessions.

import { auth } from 'flight-reactware';

import centerUsers from '../../modules/centerUsers';

let previousCurrentUser;
function loadUserWhenAuthChanges(dispatch, getState) {
  const currentUser = auth.selectors.currentUserSelector(getState());
  if (currentUser !== previousCurrentUser) {
    previousCurrentUser = currentUser;
    if (currentUser != null) {
      const promise = dispatch(centerUsers.actions.loadUser(currentUser.username));
      if (promise) { promise.catch(e => e); }
    }
  }
};

export default [
  loadUserWhenAuthChanges,
];
