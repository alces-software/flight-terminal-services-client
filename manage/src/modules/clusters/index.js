/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the clusters module.

import { jsonApi, apiRequest } from 'flight-reactware';

import * as components from './components';
import * as constants from './constants';
import * as pages from './pages';
import * as selectors from './selectors';
import reducer from './reducer';

const loadingStatesConfig = {
  resourceType: constants.NAME,
  key: resource => {
    if (resource.meta != null && resource.meta.loadingStates != null) {
      return resource.meta.loadingStates.key;
    }
    return resource.attributes.hostname;
  },
  self: {
    pending: jsonApi.actionTypes.RESOURCE_REQUESTED,
    rejected: apiRequest.rejected(jsonApi.actionTypes.RESOURCE_REQUESTED),
    resolved: apiRequest.resolved(jsonApi.actionTypes.RESOURCE_REQUESTED),
  },
  relationship: {
    related: {
      pending: jsonApi.actionTypes.RELATION_REQUESTED,
      rejected: apiRequest.rejected(jsonApi.actionTypes.RELATION_REQUESTED),
      resolved: apiRequest.resolved(jsonApi.actionTypes.RELATION_REQUESTED),
    },
    self: {
      pending: jsonApi.actionTypes.LINKAGE_DATA_REQUESTED,
      rejected: apiRequest.rejected(jsonApi.actionTypes.LINKAGE_DATA_REQUESTED),
      resolved: apiRequest.resolved(jsonApi.actionTypes.LINKAGE_DATA_REQUESTED),
    }
  },
};

export default {
  ...components,
  constants,
  loadingStatesConfig,
  pages,
  reducer,
  selectors,
};
