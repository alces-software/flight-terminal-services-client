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

function hostnameFromProps(state, props) {
  return props.hostname;
}

export const retrieval = createSelector(
  clustersState,
  hostnameFromProps,

  loadingStates.selectors.retrieval,
);

export const fromHostname = createSelector(
  clustersState,
  hostnameFromProps,

  (as, hostname) => as.data[hostname],
);
