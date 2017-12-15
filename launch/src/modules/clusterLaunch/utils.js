/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

export function getDefaultEmail(props, state={}) {
  const token = state.token || props.token;
  const launchUser = state.launchUser || props.launchUser;
  return (token && token.attributes.assignedTo) ||
    (launchUser && launchUser.attributes.email) ||
    null;
}

export function useCredits({ clusterSpec, launchUser }) {
  const solo = clusterSpec.fly.args.includes('--solo');
  return !!(!solo && launchUser && launchUser.attributes.computeCredits > 0);
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
