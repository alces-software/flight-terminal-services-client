/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { MODAL_HIDDEN, MODAL_SHOWN } from './actionTypes';

const initialState = {
  showingModal: false,
  // The queue action either CREATE or MODIFY.
  action: undefined,
  // The queue being created or modified.
  editingQueue: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_SHOWN:
      return {
        ...state,
        action: action.payload.action,
        editingQueue: action.payload.queue,
        showingModal: true,
      };

    case MODAL_HIDDEN:
      return { ...state, showingModal: false };

    default:
      return state;
  }
}
