import * as selectors from './selectors';
import { FORM_MODAL_HIDDEN, FORM_MODAL_SHOWN } from './actionTypes';

export const showModal = (clusterSpec, clusterSpecsFile) => ({
  type: FORM_MODAL_SHOWN,
  payload: {
    clusterSpec,
    clusterSpecsFile,
  },
});

export const hideModal = () => (dispatch, getState) => {
  const existingModalData = selectors.formModal.modalData(getState());

  return dispatch({
    type: FORM_MODAL_HIDDEN,
    ...existingModalData,
  });
};
