import { middleware } from 'flight-reactware';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default [
  thunk,
  logger,
  middleware,
];
