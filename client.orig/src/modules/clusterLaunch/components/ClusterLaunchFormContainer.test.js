/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import ClusterLaunchFormContainer from './ClusterLaunchFormContainer';

const initialState = {
  tokens: { meta: { loadingState: {}} },
};
const store = configureMockStore()(initialState);

const clusterSpec = {
  ui: {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
  },
  launchOptions: {
    defaultOptionIndex: 0,
    options: [{
      costPerHour: 1,
      name: 'Standard',
      description: 'The standard',
    }],
  },
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ClusterLaunchFormContainer
        clusterSpecsFile="dev"
        clusterSpec={clusterSpec}
        onCancel={() => {}}
      />
    </Provider>,
    div
  );
});
