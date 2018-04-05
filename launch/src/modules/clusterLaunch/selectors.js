import { createSelector } from 'reselect';
import { modals } from 'flight-reactware';

import { NAME } from './constants';

export const isModalShowing = modals.createModalSelector(NAME, 'launchModal');
export const modalData = modals.createModalDataSelector(NAME, 'launchModal');

export const clusterSpecsFile = createSelector(
  modalData,

  (data) => data.payload == null ? undefined : data.payload.clusterSpecsFile,
);

export const clusterSpec = createSelector(
  modalData,

  (data) => data.payload == null ? undefined : data.payload.clusterSpec,
);
