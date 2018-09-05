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
    // For non-admin users we have two cases: 1) we know the service they are
    // after; 2) we don't know the service they are after.
    if (serviceType != null) {
      // We know the service and the site is implicitly *their* site.  We can
      // load the terminal service config and redirect to the correct terminal
      // page.
      fetchServicesAndRedirect(dispatch, serviceType);
    } else {
      // Send them back to Center so they can select the service.
      const url = ContextLink.makeLinkProps('Center', '/').href;
      window.location = url;
    }
  } else {
    // For admin users we have three cases: 1) we know both the site and
    // service they are after; 2) we don't know the site they are after; 3) we
    // don't know the service they are after.
    if (serviceType != null && site.id != null) {
      fetchServicesAndRedirect(dispatch, serviceType, site.id);
    } else if (site.id != null) {
      // Send them back to Center so they can select the service.
      const url = ContextLink.makeLinkProps('Center', `/sites/${site.id}`).href;
      window.location = url;
    } else {
      // Send them back to Center so they can select the site.
      const url = ContextLink.makeLinkProps('Center', '/sites').href;
      window.location = url;
    }
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
