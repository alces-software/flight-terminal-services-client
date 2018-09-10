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
  const clusterId = services.selectors.clusterId(getState());
  const serviceType = services.selectors.serviceType(getState());
  const siteId = services.selectors.siteId(getState());

  if (centerUser === previousCenterUser) { return; }
  if (centerUser == null) { return; }
  previousCenterUser = centerUser;

  if (!centerUser.isAdmin) {
    // For non-admin users we have three cases: 1) we know the service they
    // are after and the cluster is either specified or it is assumed to be a
    // site service; 2) we know the cluster they are after but not the
    // service; cluster is not specified; 3) we don't know the service they
    // are after and the cluster is not specified.
    if (serviceType != null) {
      // We know the service and the scope is either implicitly *their* site
      // or the specified cluster.  We can load the terminal service config
      // and redirect to the correct terminal page.
      fetchServicesAndRedirect(dispatch, serviceType, clusterId);
    } else if (clusterId != null) {
      // They are after a cluster service, but have not provided the service
      // type.  Send them back to Center so they can select the cluster service.
      const url = ContextLink.makeLinkProps('Center', `/clusters/${clusterId}`).href;
      window.location = url;
    } else {
      // Send them back to Center so they can select the site service.
      const url = ContextLink.makeLinkProps('Center', '/').href;
      window.location = url;
    }
  } else {
    // For admin users we have three cases: 1) we know the service and either
    // the site or cluster they are after; 2) we know the site they are
    // after, but not the service; 3) we know the cluster they are after but
    // not the service; 4) we don't know the service they are after.
    if (serviceType != null && (clusterId != null || siteId != null)) {
      fetchServicesAndRedirect(dispatch, serviceType, clusterId, siteId);
    } else if (clusterId != null) {
      // Send them back to Center so they can select the cluster service.
      const url = ContextLink.makeLinkProps('Center', `/clusters/${clusterId}`).href;
      window.location = url;
    } else if (siteId != null) {
      // Send them back to Center so they can select the site service.
      const url = ContextLink.makeLinkProps('Center', `/sites/${siteId}`).href;
      window.location = url;
    } else {
      // Send them back to Center so they can select the site.
      const url = ContextLink.makeLinkProps('Center', '/sites').href;
      window.location = url;
    }
  }
}

function fetchServicesAndRedirect(dispatch, serviceType, clusterId, siteId) {
  const action = services.actions.fetchTerminalServicesConfig(
    siteId,
    clusterId,
    serviceType
  );
  const promise = dispatch(action);
  if (promise) {
    promise
      .then(() => {
        if (clusterId) {
          dispatch(push(`/clusters/${clusterId}/${serviceType}`));
        } else if (siteId) {
          dispatch(push(`/sites/${siteId}/${serviceType}`));
        } else {
          dispatch(push(`/${serviceType}`));
        }
      })
      .catch(e => e);
  }
}

export default [
  auth.logic.checkSessionMaturity,
  auth.logic.checkSessionExpiration,
  loadUserWhenAuthChanges,
  loadTerminalServicesConfigWhenAuthChanges,
];
