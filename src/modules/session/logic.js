/*=============================================================================
 * Copyright (C) 2017-2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Business logic handling sessions.

import { auth } from 'flight-reactware';
import { push } from 'react-router-redux';

import ContextLink from '../../elements/ContextLink';
import centerUsers from '../../modules/centerUsers';
import services from '../../modules/services';

let previousSsoUser;
function loadUserWhenAuthChanges(dispatch, getState) {
  const ssoUser = auth.selectors.currentUserSelector(getState());
  if (ssoUser == null) {
    previousSsoUser = null;
    return;
  }
  const previousId = previousSsoUser == null ? null : previousSsoUser.flight_id;
  if (ssoUser.flight_id !== previousId) {
    previousSsoUser = ssoUser;
    if (ssoUser != null) {
      const promise = dispatch(centerUsers.actions.loadUser(ssoUser.username));
      if (promise) { promise.catch(e => e); }
    }
  }
};

let previousCenterUser;
function loadTerminalServicesConfigWhenAuthChanges(dispatch, getState) {
  const centerUser = centerUsers.selectors.currentUser(getState());
  const site = services.selectors.site(getState());
  const serviceType = services.selectors.serviceType(getState());

  if (centerUser === previousCenterUser) { return; }
  if (centerUser == null) { return; }
  previousCenterUser = centerUser;

  if (!centerUser.isAdmin) {
    // A non-admin user.  The site is implicitly *their* site.  Let's load the
    // terminal services config and redirect to the directory terminal.
    // XXX We can't automatically redirect to the directory terminal.  their
    // site may not have one; or they may have previously been on another
    // service.
    fetchServicesAndRedirect(dispatch, serviceType);
  } else if (site.id != null) {
    // We have an admin user, and we know which site they are interested
    // in.  Let's load the terminal services config and redirect to the
    // directory terminal.
    // XXX We can't automatically redirect to the directory terminal.  their
    // site may not have one; or they may have previously been on another
    // service.
    fetchServicesAndRedirect(dispatch, serviceType, site.id);
  } else {
    // We have an admin user, but we don't know which site they are interested
    // in.  Redirect to Center and they can select.
    const url = ContextLink.makeLinkProps('Center', '/sites',).href;
    window.location = url;
  }
}

function fetchServicesAndRedirect(dispatch, serviceType, siteId) {
  const action = services.actions.fetchTerminalServicesConfig(
    siteId,
    serviceType
  );
  const promise = dispatch(action);
  if (promise) {
    promise
      .then(() => { dispatch(push(`/${serviceType}`)); })
      .catch(e => e);
  }
}

export default [
  auth.logic.checkSessionMaturity,
  auth.logic.checkSessionExpiration,
  loadUserWhenAuthChanges,
  loadTerminalServicesConfigWhenAuthChanges,
];
