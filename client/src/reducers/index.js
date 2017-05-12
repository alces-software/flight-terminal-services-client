/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

import onboarding from '../modules/onboarding';

export default combineReducers({
  [onboarding.constants.NAME]: onboarding.reducer,
});
