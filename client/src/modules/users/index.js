/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the onboarding module.

import { jsonApi, apiRequest } from 'flight-reactware';

import * as actions from './actions';
import * as constants from './constants';
import * as selectors from './selectors';

const indexes = [{
  entityType: constants.NAME,
  indexName: 'name',
  indexAttribute: entity => entity.attributes.name,
}];

const loadingStatesConfig = {
  resourceType: constants.NAME,
  key: resource => resource.meta.loadingStates.key || resource.attributes.name,
  pending: jsonApi.actionTypes.RESOURCE_REQUESTED,
  rejected: apiRequest.rejected(jsonApi.actionTypes.RESOURCE_REQUESTED),
  resolved: apiRequest.resolved(jsonApi.actionTypes.RESOURCE_REQUESTED),
};

export default {
  actions,
  constants,
  indexes,
  loadingStatesConfig,
  selectors,
};

