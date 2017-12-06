/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the queueManagement module.

import * as components from './components';
import * as constants from './constants';
import * as pages from './pages';
// import * as selectors from './selectors';
import reducer from './reducer';

export default {
  ...components,
  constants,
  pages,
  reducer,
  // selectors,
};
