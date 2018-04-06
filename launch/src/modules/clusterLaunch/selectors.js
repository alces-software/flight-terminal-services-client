import { createSelector } from 'reselect';
import { modals } from 'flight-reactware';

import { NAME } from './constants';

const formModalData = modals.createModalDataSelector(NAME, 'form', 'modal');

export const formModal = {
  modalData: formModalData,

  isModalOpen: modals.createModalSelector(NAME, 'form', 'modal'),

  clusterSpecsFile: createSelector(
    formModalData,
    (data) => data.payload == null ? undefined : data.payload.clusterSpecsFile,
  ),

  clusterSpec: createSelector(
    formModalData,
    (data) => data.payload == null ? undefined : data.payload.clusterSpec,
  )
};
