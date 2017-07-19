/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import { createLogger } from 'redux-logger';

function configureLoggerMiddleware() {
  if (process.env.NODE_ENV === 'production') {
    // We don't want logging in production.  We aren't going to be able to
    // access the logs so they don't really do us any good.
    const identityMiddleware = () => nextMiddleware => action => nextMiddleware(action);
    return identityMiddleware;
  }

  const options = {
    collapsed: true,
    duration: true,
    level: 'info',
  };
  return createLogger(options);
}

const middleware = configureLoggerMiddleware();
export default middleware;
