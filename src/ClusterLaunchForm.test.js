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

import { ClusterLaunchForm } from './ClusterLaunchForm';

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

const values = {
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      handleSubmit={() => {}}
      values={values}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />,
    div
  );
});

describe('pages render without crashing', () => {
  const wrapper = shallow(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      handleSubmit={() => {}}
      values={values}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  );

  const instance = wrapper.instance();
  instance.pages.forEach((page, index) => {
    test(`page ${index}`, () => {
      const div = document.createElement('div');
      ReactDOM.render(page(), div);
    });
  });
});
