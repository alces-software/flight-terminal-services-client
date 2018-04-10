import { combineReducers } from 'redux';
import { modals } from 'flight-reactware';

import {
  ERROR_MODAL_HIDDEN,
  ERROR_MODAL_SHOWN,
  FORM_MODAL_HIDDEN,
  FORM_MODAL_SHOWN,
  SUCCESS_MODAL_HIDDEN,
  SUCCESS_MODAL_SHOWN,
} from './actionTypes';

const reducer = combineReducers({
  error: combineReducers({
    modal: modals.createModalReducer(ERROR_MODAL_SHOWN, ERROR_MODAL_HIDDEN),
  }),

  form: combineReducers({
    modal: modals.createModalReducer(FORM_MODAL_SHOWN, FORM_MODAL_HIDDEN),
  }),

  success: combineReducers({
    modal: modals.createModalReducer(SUCCESS_MODAL_SHOWN, SUCCESS_MODAL_HIDDEN),
  }),
});

export default reducer;
