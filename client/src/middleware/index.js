/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import logger from './logger';

const enhanceWithMiddleware = applyMiddleware(
  thunk,
  logger,
);

export default enhanceWithMiddleware;