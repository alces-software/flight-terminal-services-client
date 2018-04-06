import { combineReducers } from 'redux';
import { modals } from 'flight-reactware';

import {
  FORM_MODAL_HIDDEN,
  FORM_MODAL_SHOWN,
} from './actionTypes';


const reducer = combineReducers({
  form: combineReducers({
    modal: modals.createModalReducer(FORM_MODAL_SHOWN, FORM_MODAL_HIDDEN),
  }),
});

export default reducer;
