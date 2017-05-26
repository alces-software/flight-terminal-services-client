/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the onboarding module.

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import * as constants from './constants';
import * as selectors from './selectors';
import reducer from './reducer';

export default { actions, actionTypes, constants, reducer, selectors };
