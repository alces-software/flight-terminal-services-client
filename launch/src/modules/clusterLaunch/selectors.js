import { createSelector } from 'reselect';
import { modals } from 'flight-reactware';

import { NAME } from './constants';

const errorModalData = modals.createModalDataSelector(NAME, 'error', 'modal');
const formModalData = modals.createModalDataSelector(NAME, 'form', 'modal');
const launchedModalData = modals.createModalDataSelector(NAME, 'launched', 'modal');

export const errorModal = {
  modalData: errorModalData,

  isModalOpen: modals.createModalSelector(NAME, 'error', 'modal'),

  error: createSelector(
    errorModalData,
    (data) => data.payload == null ? undefined : data.payload.error,
  ),

  title: createSelector(
    errorModalData,
    (data) => data.payload == null ? undefined : data.payload.title,
  ),
};

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

export const launchedModal = {
  modalData: launchedModalData,

  isModalOpen: modals.createModalSelector(NAME, 'launched', 'modal'),

  clusterName: createSelector(
    launchedModalData,
    (data) => data.payload == null ? undefined : data.payload.clusterName,
  ),

  email: createSelector(
    launchedModalData,
    (data) => data.payload == null ? undefined : data.payload.email,
  ),
};
