// Import and export the public facing API for the clusterSpecs module.

import * as actions from './actions';
import * as components from './components';
import * as pages from './pages';
import * as constants from './constants';
import * as selectors from './selectors';
import reducer from './reducer';

export default {
  actions,
  ...components,
  constants,
  pages,
  reducer,
  selectors,
};
