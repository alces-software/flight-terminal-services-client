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

function totalAccruedUsageForApReducer(state = {}, { meta, payload, type }) {
  switch (type) {
    case apiRequest.resolved(jsonApi.actionTypes.RELATION_REQUESTED):
      const relationName = get(meta, 'previousAction.meta.relationName');
      const entityType = get(meta, 'previousAction.meta.entity.type');
      if (entityType !== 'clusters' || relationName !== 'creditUsages') {
        return state;
      }
      const usage = get(payload, 'data.meta.totalAccruedUsageForAp');
      const entityId = get(meta, 'previousAction.meta.entity.id');
      return {
        ...state,
        [entityId]: usage
      };

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
