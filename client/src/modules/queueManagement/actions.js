/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { jsonApi } from 'flight-reactware';

import { MODAL_HIDDEN, MODAL_SHOWN } from './actionTypes';
import * as selectors from './selectors';

// Create a ComputeQueueActionResource on the launch server which will
// eventually be processed to create or modify the queue.
export function createOrModifyQueue(cluster, attributes) {
  return (dispatch, getState) => {
    const queueDescriptor = selectors.queueDescriptor(getState());
    const queueAction = selectors.queueAction(getState());

    const action = computeQueueActionCreator(
      cluster, queueAction, queueDescriptor.name, attributes
    );

    return dispatch(action)
      .then((response) => {
        dispatch(hideQueueManagementForm());
        return response;
      });
  };
}

export function removeQueue(cluster, queueSpecName) {
  return computeQueueActionCreator(cluster, 'DELETE', queueSpecName);
}

function computeQueueActionCreator(
  cluster,
  queueAction,
  queueSpecName,
  attributes={},
) {
  return jsonApi.actions.createResource({
    type: 'computeQueueActions',
    attributes: {
      ...attributes,
      action: queueAction,
      spec: queueSpecName,
    },
    relationships: {
      cluster: { data: { type: 'clusters', id: cluster.id } },
    },
    links: { self: '/api/v1/compute-queue-actions' },
  });
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

export function showQueueManagementForm(queueSpecName, action) {
  return {
    type: MODAL_SHOWN,
    payload: {
      action,
      queueSpecName,
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
        params: {},
      });
      return dispatch(action);
    }
  }
}
