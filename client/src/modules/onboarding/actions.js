/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { saveState } from '../../utils/persistence';
import { WELCOME_MESSAGE_READ } from './actionTypes';

// XXX Move this elsewhere.
function persistingState(action) {
  return (dispatch, getState) => {
    const result = dispatch(action);

    saveState({
      onboarding: getState().onboarding,
    });

    return result;
  };
}

export const setWelcomeMessageRead = () => persistingState({
  type: WELCOME_MESSAGE_READ,
  payload: true,
});

export function showWelcomeMessage() {
  return {
    type: WELCOME_MESSAGE_READ,
    payload: false,
  };
}
