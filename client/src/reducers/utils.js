/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

//
// Return a new reducer which calls each provided reducer in turn.
//
export function reduceReducers(...reducers) {
  return (state, action) => (
    reducers.reduceRight(
      (newState, nextReducer) => nextReducer(newState, action),
      state,
    )
  );
}

//
// Return a new reducer which runs `mainReducer` on the full state and
// extraReducersMap on a named slice of the state.
//
// E.g., given the following definitions:
//
//   const addingReducer = (state={total: 0}, action) => (
//     { ...state, total: state.add + action.payload }
//   );
//   const countingReducer = (state={timesCalled: 0}, action) => (
//     { ...state, timesCalled: state.timesCalled + 1 }
//   );
//   const combinedReducer = addReducers(addingReducer, { meta: countingReducer });
//
// the following will be true
//
// combinedReducer(undefined, {payload: 2}) === {add: 2, meta: {timesCalled: 1}};
// combinedReducer({add: 2, meta: {timesCalled: 1}}, {payload: 4}) === {add: 6, meta: {timesCalled: 2}};
//
export function addReducers(mainReducer, extraReducersMap) {
  if (extraReducersMap == null) {
    return mainReducer;
  }

  const extraReducers = combineReducers(extraReducersMap);

  return function combination(state, action) {
    let hasChanged = false;
    const nextMainState = mainReducer(state, action);
    const nextExtraState = extraReducers(nextMainState, action);

    hasChanged = state !== nextMainState || nextMainState !== nextExtraState;

    return hasChanged ? { ...nextMainState, ...nextExtraState } : state;
  };
}
