/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { NAME } from './constants';

export function localSavedState(state) {
  return {
    isWelcomeMessageRead: state[NAME].isWelcomeMessageRead,
  };
}
