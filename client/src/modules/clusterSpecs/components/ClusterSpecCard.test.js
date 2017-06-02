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

import ClusterSpecCard from './ClusterSpecCard';

const clusterSpec = {
  ui: {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
    scheduler: {
      type: "slurm",
      text: "Slurm",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Slurm_Workload_Manager.png/262px-Slurm_Workload_Manager.png",
      tooltip: "This cluster uses the Slurm scheduler"
    }
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

const initialState = {
  clusterSpecs: {
    file: 'test',
  },
  tenants: {},
  tokens: { meta: { loadingState: {}} },
};
const store = configureMockStore()(initialState);

const commonProps = {
  onCancel: () => {},
  showBack: () => {},
  showFront: () => {},
}

it('renders without crashing (flipped)', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ClusterSpecCard
        clusterSpec={clusterSpec}
        {...commonProps}
        flipped
      />
    </Provider>,
    div);
});

it('renders without crashing (not flipped)', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ClusterSpecCard
        clusterSpec={clusterSpec}
        {...commonProps}
        flipped={false}
      />
    </Provider>,
    div);
});
