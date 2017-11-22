/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { createSelector } from 'reselect';
import { selectorUtils } from 'flight-reactware';

import clusters from '../../modules/clusters';

import { NAME } from './constants';

const stateSlice = state => state[NAME];

export function showingModal(state) {
  return stateSlice(state).showingModal;
}

export function editingQueue(state) {
  return stateSlice(state).editingQueue;
}

export function queueEditAction(state) {
  return stateSlice(state).action;
}

export function isCreatingQueue(state) {
  return queueEditAction(state) === 'CREATE';
}

export const retrieval = clusters.selectors.relationshipRetrieval('computeQueueActions');

export const computeQueueActions = createSelector(
  clusters.selectors.currentCluster,
  selectorUtils.buildJsonApiResourceSelectors('computeQueueActions').jsonApiData,
  () => 'computeQueueActions',

  selectorUtils.relatedResourcesSelector,
);

export const allQueues = createSelector(
  clusters.selectors.currentCluster,
  computeQueueActions,

  (cluster, queueActions) => {
    const { availableComputeQueues, currentComputeQueues } = cluster.attributes;

    const currentQueuesMap = currentComputeQueues.reduce(
      (accum, q) => { accum[q.spec] = q; return accum; },
      {}
    );

    const createOrModifyActionsMap = [].concat(queueActions)
      .filter(qa => qa)
      .sort(qa => qa.attributes.createdAt)  // Take only the most recent.
      .filter(({ attributes: qa }) =>
        ['PENDING', 'IN_PROGRESS'].includes(qa.status)
      )
      .reduce(
        (accum, { attributes }) => { accum[attributes.spec] = attributes; return accum; },
        {}
      );

    const queues = availableComputeQueues
      .map(qspec => {
        const queue = currentQueuesMap[qspec.spec];
        const createOrModifyAction = createOrModifyActionsMap[qspec.spec];
        let status;
        if (createOrModifyAction == null && queue == null) {
          status = 'UNCONFIGURED';
        } else if (createOrModifyAction == null && queue != null) {
          status = 'CREATE_COMPLETE';
        } else {
          status = `${createOrModifyAction.action}_IN_PROGRESS`;
        }

        return {
          current: queue,
          spec: qspec,
          status: status,
          modification: createOrModifyAction,
        };
      });

    return queues;
  },
);
