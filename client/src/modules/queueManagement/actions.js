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

export function createComputeQueueAction(cluster, attributes) {
  return (dispatch, getState) => {
    const queueDescriptor = selectors.queueDescriptor(getState());
    const queueAction = selectors.queueAction(getState());

    const action = jsonApi.actions.createResource({
      type: 'computeQueueActions',
      attributes: {
        ...attributes,
        action: queueAction,
        spec: queueDescriptor.name,
      },
      relationships: {
        cluster: { data: { type: 'clusters', id: cluster.id } },
      },
      links: { self: '/api/v1/compute-queue-actions' },
    });

    return dispatch(action)
      .then((response) => {
        dispatch(hideModal());
        return response;
      });
  };
}


export function toggleModal() {
  return (dispatch, getState) => {
    const showingModal = selectors.showingModal(getState());
    if (showingModal) {
      dispatch(hideModal());
    } else {
      dispatch(showModal());
    }
  }
}


export function hideModal() {
  return {
    type: MODAL_HIDDEN,
  };
}

export function showModal(queueDescriptor, action) {
  return {
    type: MODAL_SHOWN,
    payload: {
      action,
      queueDescriptor,
    },
  };
}
