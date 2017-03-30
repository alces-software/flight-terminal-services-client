/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import ClusterSpecCardContainer from './ClusterSpecCardContainer';

const clusterSpec = {
  ui: {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
    autoscaling: false,
    usesSpot: true,
    scheduler: {
      type: "slurm",
      text: "Slurm",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Slurm_Workload_Manager.png/262px-Slurm_Workload_Manager.png",
      tooltip: "This cluster uses the Slurm scheduler"
    }
  },
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ClusterSpecCardContainer clusterSpec={clusterSpec} />, div);
});

