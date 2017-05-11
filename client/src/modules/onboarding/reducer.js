/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { WELCOME_MESSAGE_READ } from './actionTypes';

const initialState = {
  welcomeMessageRead: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case WELCOME_MESSAGE_READ:
      return { ...state, welcomeMessageRead: action.payload };

    default:
      return state;
  }
}
