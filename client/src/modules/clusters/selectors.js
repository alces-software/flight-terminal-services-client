/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { loadingStates, selectorUtils } from 'flight-reactware';

import { NAME } from './constants';

const clustersState = state => state[NAME];

const {
  jsonApiState,
  jsonApiData,
} = selectorUtils.buildJsonApiResourceSelectors(NAME);

export function hostname(state) {
  return clustersState(state).hostname;
}

function hostnameFromPropsOrStore(state, props) {
  return props.hostname || hostname(state);
}

const hostnameIndex = selectorUtils.buildIndexSelector(NAME, 'hostname');

export const retrieval = createSelector(
  jsonApiState,
  hostnameFromPropsOrStore,

  loadingStates.selectors.retrieval,
);

export const currentCluster = createSelector(
  jsonApiData,
  hostnameIndex,
  hostname,

  selectorUtils.resourceFromIndex,
);
