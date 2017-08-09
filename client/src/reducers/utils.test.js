import { addReducers } from './utils';

describe('addReducers', () => {
  const addingReducer = (state={ total: 0 }, action) => {
    if (action.payload && action.payload.add) {
      return {
        ...state,
        total: state.total + action.payload.add,
      };
    }
    return state;
  };

  const countingReducer = (state={ timesCalled: 0 }, action) => {
    if (action.payload && action.payload.add) {
      return {
        ...state,
        timesCalled: state.timesCalled + 1,
      };
    }
    return state;
  };

  const combinedReducer = addReducers(addingReducer, { meta: countingReducer });

  it('correctly sets initial state', () => {
    const initialState = combinedReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({ total: 0, meta: { timesCalled: 0 } });
  });

  it('correctly updates the state', () => {
    const firstState = { total: 0, meta: { timesCalled: 0 } };
    const secondState = combinedReducer(firstState, {
      type: 'my_type',
      payload: { add: 2 },
    });

    expect(secondState).toEqual({ total: 2, meta: { timesCalled: 1 } });
  });
});
