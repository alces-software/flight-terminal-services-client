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

export function queueSpec(state) {
  return stateSlice(state).queueSpec;
}

export function queueAction(state) {
  return stateSlice(state).action;
}

export const retrieval = clusters.selectors.relationshipRetrieval('computeQueueActions');

export const computeQueueActions = createSelector(
  clusters.selectors.currentCluster,
  selectorUtils.buildJsonApiResourceSelectors('computeQueueActions').jsonApiData,
  () => 'computeQueueActions',

  selectorUtils.relatedResourcesSelector,
);

// XXX complete comment Return a list of the current clusters compute queues
export const currentQueues = createSelector(
  clusters.selectors.currentCluster,
  computeQueueActions,

  (cluster, queueActions) => {
    const queueSpecs = cluster.attributes.availableComputeQueues.reduce(
      (accum, qs) => {
        accum[qs.name] = qs;
        return accum;
      },
      {}
    );

    // An array of pending queue actions to create a queue.  This is massaged
    // into the same format as the array of current queues.
    const queuesBeingCreated = queueActions
      .filter(qa => qa)
      .filter(({ attributes: qa }) =>
        ['PENDING', 'IN_PROGRESS'].includes(qa.status) && qa.action === 'CREATE'
      )
      .map(qa => ({
        current: qa.attributes.desired,
        max: qa.attributes.max,
        min: qa.attributes.min,
        spec: queueSpecs[qa.attributes.spec],
        status: 'CREATE_IN_PROGRESS',
      }));

    // A hash of the existing queues with a pending action to modify them.
    const queueSpecsBeingModified = [].concat(queueActions)
      .filter(qa => qa)
      .sort(qa => qa.attributes.createdAt)
      .filter(({ attributes: qa }) =>
        ['PENDING', 'IN_PROGRESS'].includes(qa.status) && qa.action === 'MODIFY'
      )
      .reduce(
        (accum, qa) => {
          accum[qa.attributes.spec] = {
            current: qa.attributes.desired,
            max: qa.attributes.max,
            min: qa.attributes.min,
          };
          return accum;
        },
        {}
      );

    // An array of the current queues, including a status flag to indicate if
    // there is a pending modification action for it.
    const currentQueues = cluster.attributes.currentComputeQueues
      .map(q => {
        const modifyAction = queueSpecsBeingModified[q.spec];
        const status = modifyAction ? 'MODIFY_IN_PROGRESS' : 'COMPLETE';
        return {
          ...q,
          spec: queueSpecs[q.spec],
          status: status,
          modification: modifyAction,
        };
      });

    return [...currentQueues, ...queuesBeingCreated].sort(q => q.spec);
  },
);

export const availableQueues = createSelector(
  clusters.selectors.currentCluster,
  currentQueues,

  (cluster, current) => {
    const { availableComputeQueues } = cluster.attributes;
    const currentQueueNames = current.map(q => q.spec);
    const availableQueues = availableComputeQueues
      .filter(q => !currentQueueNames.includes(q.name));
    return availableQueues;
  }
);
