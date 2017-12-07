import { SubmissionError } from 'redux-form';
import { get } from 'lodash';

import launchUsers from '../../modules/launchUsers';

import {
  MODAL_HIDDEN,
  MODAL_SHOWN,
  TOKEN_TOP_UP_REQUESTED,
} from './actionTypes';

export const showModal = (error) => ({
  type: MODAL_SHOWN,
  error,
});

export const hideModal = () => ({
  type: MODAL_HIDDEN,
});

export function topupFromToken(tenantIdentifier, tokenName) {
  return (dispatch, getState) => {
    const action = {
      type: TOKEN_TOP_UP_REQUESTED,
      meta: {
        apiRequest: {
          config: {
            method: 'post',
            url: '/packs/top-up-from-token',
            data: {
              tenant: {
                identifier: tenantIdentifier,
              },
              token: {
                name: tokenName,
              }
            }
          }
        }
      }
    };

    return dispatch(action)
      .catch((e) => {
        const details = get(e, 'error.response.data.details');
        if (details) {
          return Promise.reject(new SubmissionError(details));
        }
        return Promise.reject(e);
      })
      .then(() => dispatch(showModal()))
      .catch((e) => {
        dispatch(showModal(e));
        return Promise.reject(e);
      })
      .then(() => dispatch(launchUsers.actions.reloadCurrentUser()));
  };
}
