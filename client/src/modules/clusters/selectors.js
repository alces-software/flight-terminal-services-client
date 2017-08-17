/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';

import loadingStates from '../../modules/loadingStates';

import { NAME } from './constants';

const clustersState = state => state[NAME];

function ipAddressFromProps(state, props) {
  return props.ipAddress;
}

export const retrieval = createSelector(
  clustersState,
  ipAddressFromProps,

  (as, ipAddress) => ({
    initiated: loadingStates.selectors.isInitiated(as, ipAddress), 
    pending: loadingStates.selectors.isPending(as, ipAddress),
    resolved: loadingStates.selectors.isResolved(as, ipAddress),
    rejected: loadingStates.selectors.isRejected(as, ipAddress),
  }),
);

export const fromIpAddress = createSelector(
  clustersState,
  ipAddressFromProps,

  (as, ipAddress) => as.data[ipAddress],
);
