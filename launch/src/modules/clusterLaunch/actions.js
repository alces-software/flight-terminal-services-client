import * as selectors from './selectors';
import {
  ERROR_MODAL_HIDDEN,
  ERROR_MODAL_SHOWN,
  FORM_MODAL_HIDDEN,
  FORM_MODAL_SHOWN,
  SUCCESS_MODAL_HIDDEN,
  SUCCESS_MODAL_SHOWN,
} from './actionTypes';

export const formModal = {
  show: (clusterSpec, clusterSpecsFile) => ({
    type: FORM_MODAL_SHOWN,
    payload: {
      clusterSpec,
      clusterSpecsFile,
    },
  }),

  hide: () => (dispatch, getState) => {
    const existingModalData = selectors.formModal.modalData(getState());

    return dispatch({
      type: FORM_MODAL_HIDDEN,
      ...existingModalData,
    });
  },
};

export const successModal = {
  show: (clusterName, email) => ({
    type: SUCCESS_MODAL_SHOWN,
    payload: {
      clusterName,
      email,
    },
  }),

  hide: () => ({
    type: SUCCESS_MODAL_HIDDEN,
  }),
};

export const errorModal = {
  show: ({ error, title }) => ({
    type: ERROR_MODAL_SHOWN,
    payload: {
      error,
      title,
    },
  }),

  hide: () => ({
    type: ERROR_MODAL_HIDDEN,
  })
};
