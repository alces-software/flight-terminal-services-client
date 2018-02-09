/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the onboarding module.

import { jsonApi, apiRequest } from 'flight-reactware';
import { get } from 'lodash';

import * as actions from './actions';
import * as constants from './constants';
import * as selectors from './selectors';

const indexes = [{
  entityType: constants.NAME,
  indexName: 'username',
  indexAttribute: entity => entity.attributes.username,
}];

const loadingStatesConfig = {
  resourceType: constants.NAME,
  key: resource => (
    get(resource, 'meta.loadingStates.key') ||
    get(resource, 'attributes.username')
  ),
  self: {
    pending: jsonApi.actionTypes.RESOURCE_REQUESTED,
    rejected: apiRequest.rejected(jsonApi.actionTypes.RESOURCE_REQUESTED),
    resolved: apiRequest.resolved(jsonApi.actionTypes.RESOURCE_REQUESTED),
  },
  relationship: {
    pending: jsonApi.actionTypes.RELATION_REQUESTED,
    rejected: apiRequest.rejected(jsonApi.actionTypes.RELATION_REQUESTED),
    resolved: apiRequest.resolved(jsonApi.actionTypes.RELATION_REQUESTED),
  },
};

export default {
  actions,
  constants,
  indexes,
  loadingStatesConfig,
  selectors,
};
