/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import invariant from 'invariant';
import { jsonApi } from 'flight-reactware';

import tenants from '../../modules/tenants';

export function loadToken(name) {
  return (dispatch, getState) => {
    invariant(name, 'Token name must be given');

    const tenant = tenants.selectors.tenant(getState());
    const resource = {
      type: 'tokens',
      meta: {
        loadingStates: {
          key: name,
        },
      },
    };
    const action = jsonApi.actions.loadResourceByLookupKey(
      tenant.relationships.tokens.links.related,
      resource,
      'name',
      name,
    );
    return dispatch(action);
  };
}
