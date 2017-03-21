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

const error = {
  exception: 'An exception',
};

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

it('mentions emails if given an email address', () => {
  const wrapper = shallow(
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      cloudformationUrl="http://example.com"
      clusterName="clusteryMcClusterFace"
      email="me@example.com"
    />
  );

  expect(wrapper.children('p').last()).toIncludeText('We have sent an email');
});

it('does not mention emails if not given an email address', () => {
  const wrapper = shallow(
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      cloudformationUrl="http://example.com"
      clusterName="clusteryMcClusterFace"
    />
  );

  expect(wrapper.children('p').last()).not.toIncludeText('We have sent an email');
});
