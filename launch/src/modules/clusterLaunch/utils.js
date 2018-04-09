/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

export function getEmail(email, _, props) {
  if ( email != null && email.length >= 1 ) {
    return email;
  }
  return getDefaultEmail(props);
}

export function getDefaultEmail(props, state={}) {
  const token = state.token || props.token;
  const launchUser = state.launchUser || props.launchUser;
  return (token && token.attributes.assignedTo) ||
    (launchUser && launchUser.attributes.email) ||
    null;
}

function isSoloCluster(clusterSpec) {
  return clusterSpec.fly.args.includes('--solo') ||
    clusterSpec.fly.args.includes('-s');
}

export function canUseCredits({ launchUser }) {
  return !!(launchUser && launchUser.attributes.computeCredits > 0);
}

export function canSelectRuntime({ clusterSpec, launchUser, isUsingLaunchToken }) {
  return isSoloCluster(clusterSpec) &&
    canUseCredits({ launchUser }) &&
    !isUsingLaunchToken;
}

export function canSetCreditLimit({ clusterSpec, launchUser, isUsingLaunchToken }) {
  return !isSoloCluster(clusterSpec) &&
    canUseCredits({ launchUser }) &&
    !isUsingLaunchToken;
}

export function isRuntimeFixed({ clusterSpec, isUsingLaunchToken }) {
  return isSoloCluster(clusterSpec) || isUsingLaunchToken;
}

export function getClusterName({ clusterName, launchToken }) {
  if (clusterName != null && clusterName.length > 0) {
    return clusterName;
  }
  if (launchToken != null && launchToken.length > 0) {
    return getDefaultClusterName({ launchToken });
  }
}

export function getDefaultClusterName({ launchToken }) {
  if (launchToken != null && launchToken.length > 0) {
    return launchToken.toLowerCase();
  }
}
