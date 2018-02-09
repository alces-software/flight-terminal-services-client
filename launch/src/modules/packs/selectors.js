import { createSelector } from 'reselect';
import { modals } from 'flight-reactware';

import { NAME } from './constants';

export const isModalShowing = modals.createModalSelector(NAME, 'topUp');
export const modalData = modals.createModalDataSelector(NAME, 'topUp');

export const modalErrors = createSelector(
  modalData,

  (data) => data.error == null ? undefined : data.error.errors,
);
