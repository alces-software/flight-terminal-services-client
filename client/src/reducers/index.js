/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { combineReducers } from 'redux';

import clusterSpecs from '../modules/clusterSpecs';
import onboarding from '../modules/onboarding';
import tenants from '../modules/tenants';

export default combineReducers({
  [clusterSpecs.constants.NAME]: clusterSpecs.reducer,
  [onboarding.constants.NAME]: onboarding.reducer,
  [tenants.constants.NAME]: tenants.reducer,
});
