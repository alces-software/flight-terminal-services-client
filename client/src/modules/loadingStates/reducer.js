/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PENDING, RESOLVED, REJECTED } from './constants';

const initialState = {
  meta: {
    loadingState: {},
  },
};

const setLoadingState = (actionMeta, loadingState) => state => (
  {
    ...state,
    meta: {
      ...state.meta,
      loadingState: {
        ...state.meta.loadingState,
        [actionMeta.loadingState.key]: loadingState,
      }
    }
  }
);

function mergeInitialState(state) {
  if (state.meta == null || state.meta.loadingState == null) {
    state = {
      ...state,
      meta: {
        ...state.meta,
        ...initialState.meta,
      }
    };
  }
  return state;
}

// Reducer to track the loading state of entities.
export default function reducer(config) {
  return function(state = initialState, { meta, type }) {
    state = mergeInitialState(state);

    switch (type) {
      case config.pending:
        return setLoadingState(meta, PENDING)(state);

      case config.resolved:
        return setLoadingState(meta, RESOLVED)(state);

      case config.rejected:
        return setLoadingState(meta, REJECTED)(state);

      default:
        return state;
    }
  };
}
