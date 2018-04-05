import { combineReducers } from 'redux';
import { modals } from 'flight-reactware';

import { MODAL_SHOWN, MODAL_HIDDEN } from './actionTypes';

const reducer = combineReducers({
  launchModal: modals.createModalReducer(MODAL_SHOWN, MODAL_HIDDEN),
});

export default reducer;
