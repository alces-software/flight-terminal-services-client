/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PENDING, RESOLVED, REJECTED } from './constants';

const initialState = {};

const setLoadingState = (actionMeta, loadingState) => state => (
  {
    ...state,
    [actionMeta.loadingState.key]: loadingState,
  }
);

// Reducer to track the loading state of entities.
export default function reducer(config) {
  return function(state = initialState, { meta, type }) {
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
