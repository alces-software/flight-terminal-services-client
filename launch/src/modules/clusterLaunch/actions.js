import * as selectors from './selectors';
import { MODAL_HIDDEN, MODAL_SHOWN } from './actionTypes';

export const showModal = (clusterSpec, clusterSpecsFile) => ({
  type: MODAL_SHOWN,
  payload: {
    clusterSpec,
    clusterSpecsFile,
  },
});

export const hideModal = () => (dispatch, getState) => {
  const existingModalData = selectors.modalData(getState());

  return dispatch({
    type: MODAL_HIDDEN,
    ...existingModalData,
  });
};
