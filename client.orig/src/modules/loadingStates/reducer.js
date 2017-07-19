/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { LOADING, RESOLVED, REJECTED } from './constants';

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


// Reducer to track the loading state of entities.
export default function reducer(config) {
  return function(state = initialState, { meta, type }) {
    switch (type) {
      case config.loading:
        return setLoadingState(meta, LOADING)(state);

      case config.resolved:
        return setLoadingState(meta, RESOLVED)(state);

      case config.rejected:
        return setLoadingState(meta, REJECTED)(state);

      default:
        return state;
    }
  }
}
