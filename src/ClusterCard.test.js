/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import ClusterCard from './ClusterCard';

it('renders without crashing', () => {
  const clusterSpec = {
    title: 'Some title',
    subtitle: 'Some title',
    body: 'Some content',
    logoUrl: 'http://example.com/logo.png',
  };
  const div = document.createElement('div');
  ReactDOM.render(<ClusterCard clusterSpec={clusterSpec}  />, div);
});
