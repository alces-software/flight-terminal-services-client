/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import clusters from '../../modules/clusters';

import { MODAL_HIDDEN, MODAL_SHOWN } from './actionTypes';
import * as selectors from './selectors';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a ComputeQueueActionResource on the launch server which will
// eventually be processed to create or modify the queue.
export function createOrModifyQueue(cluster, attributes) {
  return (dispatch, getState) => {
    const queue = selectors.editingQueue(getState());
    const queueEditAction = selectors.queueEditAction(getState());

    const action = computeQueueActionCreator(
      cluster, queueEditAction, queue.spec.spec, attributes
    );

    return dispatch(action)
      .then(() => {
        dispatch(loadComputeQueueActionsLinkageData(cluster));
      })
      .then(() => {
        dispatch(hideQueueManagementForm());
      });
  };
}

export function removeQueue(queue) {
  return (dispatch, getState) => {
    const cluster = clusters.selectors.currentCluster(getState());
    const specName = queue.spec.spec;
    return dispatch(computeQueueActionCreator(cluster, 'DELETE', specName))
      .then(() => {
        dispatch(loadComputeQueueActionsLinkageData(cluster));
      });
  };
}

function computeQueueActionCreator(
  cluster,
  queueEditAction,
  queueSpecName,
  attributes={},
) {
  return (dispatch) => {
    const action = jsonApi.actions.createResource({
      type: 'computeQueueActions',
      attributes: {
        ...attributes,
        action: queueEditAction,
        spec: queueSpecName,
      },
      relationships: {
        cluster: { data: { type: 'clusters', id: cluster.id } },
      },
      links: { self: '/api/v1/compute-queue-actions' },
    });

    return Promise.all([
      delay(1000),
      dispatch(action)
    ]);
  };
}

export function toggleModal() {
  return (dispatch, getState) => {
    const showingModal = selectors.showingModal(getState());
    if (showingModal) {
      dispatch(hideQueueManagementForm());
    } else {
      dispatch(showQueueManagementForm());
    }
  };
}


export function hideQueueManagementForm() {
  return {
    type: MODAL_HIDDEN,
  };
}

export function showQueueManagementForm(queue, action) {
  return {
    type: MODAL_SHOWN,
    payload: {
      action,
      queue,
    },
  };
}

export function loadComputeQueueActions(cluster) {
  return (dispatch, getState) => {
    const { initiated, rejected } = selectors.retrieval(
      getState(), { hostname: cluster.attributes.hostname }
    );
    if (!initiated || rejected) {
      const action = jsonApi.actions.loadRelationshipAndLinkageData({
        source: cluster,
        relationName: 'computeQueueActions',
        params: {
          'filter[status]': 'PENDING,IN_PROGRESS'
        },
      });
      return dispatch(action);
    }
  };
}

export function loadComputeQueueActionsLinkageData(cluster) {
  return jsonApi.actions.loadRelationshipLinkageData({
    source: cluster,
    relationName: 'computeQueueActions',
  });
}
