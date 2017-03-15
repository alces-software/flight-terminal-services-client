/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import ClusterSpecCard from './ClusterSpecCard';

it('renders without crashing', () => {
  const clusterSpec = {
    ui: {
      title: 'Some title',
      subtitle: 'Some title',
      body: 'Some content',
      logoUrl: 'http://example.com/logo.png',
      autoscaling: false,
      usesSpot: true,
      scheduler: "Slurm",
    },
  };
  const div = document.createElement('div');
  ReactDOM.render(<ClusterSpecCard clusterSpec={clusterSpec}  />, div);
});
