/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { retrieval } from './selectors';

export function loadCluster(hostname) {
  // We need to include the type and the hostname attribute for the
  // loadingStates module.
  const resource = {
    type: 'clusters',
    links: {
      self: `https://${hostname}/www/index.json`,
    },
    meta: {
      loadingStates: {
        key: hostname,
      },
    },
  };
  return (dispatch, getState) => {
    const { initiated, rejected } = retrieval(getState(), { hostname });
    if (!initiated || rejected) {
      const action = jsonApi.actions.loadResource(resource);
      action.meta.apiRequest.skipAuthHeader = true;
      return dispatch(action);
    }
  };
}
