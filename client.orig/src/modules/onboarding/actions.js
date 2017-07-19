/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { WELCOME_MESSAGE_READ } from './actionTypes';

export function setWelcomeMessageRead() {
  return {
    type: WELCOME_MESSAGE_READ,
    payload: true,
  };
}

export function showWelcomeMessage() {
  return {
    type: WELCOME_MESSAGE_READ,
    payload: false,
  };
}
