/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import ClusterLaunchedModal from './ClusterLaunchedModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render((
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      clusterName="clusteryMcClusterFace"
      email="me@example.com"
    />),
    div);
});

it('mentions having sent an email', () => {
  const wrapper = shallow(
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      clusterName="clusteryMcClusterFace"
      email="me@example.com"
    />
  );

  expect(wrapper.children('p').at(1)).toIncludeText('will be sent to me@example.com');
});
