/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { retrieval } from './selectors';

const anvilBaseUrl = process.env.REACT_APP_ANVIL_BASE_URL;

export function loadUser(username) {
  // We need to include the type and the hostname attribute for the
  // loadingStates module.
  const resource = {
    type: 'users',
    links: {
      self: `${anvilBaseUrl}/v1/users/${username}`,
    },
    meta: {
      loadingStates: {
        key: username,
      },
    },
  };
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { user: username });
    if (!initiated || rejected) {
      return dispatch(jsonApi.actions.loadResource(resource, {
        'fields[users]': 'name,collections',
        include: 'collections',
        'fields[collections]': 'name,user',
      }));
    }
  };
}
