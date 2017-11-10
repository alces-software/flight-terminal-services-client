/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { retrieval } from './selectors';

export function loadUser(username) {
  // We need to include the type and the hostname attribute for the
  // loadingStates module.
  const resource = {
    type: 'launchUsers',
    meta: {
      loadingStates: {
        key: username,
      },
    },
  };
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { username: username });
    if (!initiated || rejected) {
      const action = jsonApi.actions.loadResourceByLookupKey(
        '/api/v1/launch-users',
        resource,
        'username',
        username,
      );
      return dispatch(action);
    }
  };
}