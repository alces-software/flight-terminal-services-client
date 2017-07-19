/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import ReactGA from 'react-ga';

const ANALYTICS_TRACKER_ID = process.env.REACT_APP_ANALYTICS_TRACKER_ID;

export function initialize() {
  if (process.env.NODE_ENV === 'production' && ANALYTICS_TRACKER_ID) {
    ReactGA.initialize(ANALYTICS_TRACKER_ID);
  }
}

export function pageView() {
  const location = { pathname: '/' };
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

export function clusterLaunchRequested(clusterSpec) {
  ReactGA.event({
    category: 'Cluster launch',
    action: 'Cluster launch requested',
    label: clusterSpec.ui.title,
  });
}

export function clusterLaunchAccepted(clusterSpec) {
  ReactGA.event({
    category: 'Cluster launch',
    action: 'Cluster launch accepted',
    label: clusterSpec.ui.title,
  });
}

export function clusterLaunchRejected(clusterSpec, error) {
  ReactGA.event({
    category: 'Cluster launch',
    action: 'Cluster launch rejected',
    label: `Cluster: ${clusterSpec.ui.title}, exception: ${error.exception}`
  });
}
