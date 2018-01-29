/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';
import { apiRequest, jsonApi } from 'flight-reactware';
import { get } from 'lodash';

function totalAccruedUsageForApReducer(state = null, { meta, payload, type }) {
  switch (type) {
    case apiRequest.resolved(jsonApi.actionTypes.RELATION_REQUESTED):
      const relationName = get(meta, 'previousAction.meta.relationName');
      if (relationName !== 'creditUsages') {
        return state;
      }
      const usage = get(payload, 'data.meta.totalAccruedUsageForAp');
      return usage;

    default:
      return state;
  }
}

const metaReducers = combineReducers({
  totalAccruedUsageForAp: totalAccruedUsageForApReducer,
});

export default combineReducers({
  meta: metaReducers,
});
