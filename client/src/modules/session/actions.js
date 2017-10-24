/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { auth } from 'flight-reactware';

import launchUsers from '../../modules/launchUsers';

export function loadUsers() {
  return (dispatch, getState) => {
    const currentUser = auth.selectors.currentUserSelector(getState());
    if (currentUser != null) {
      dispatch(launchUsers.actions.loadUser(currentUser.username));
    }
  };
}
