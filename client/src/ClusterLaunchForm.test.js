/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import ClusterLaunchForm from './ClusterLaunchForm';
import ClusterFormInput from './ClusterFormInput';

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

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      handleSubmit={() => {}}
      errors={{}}
      values={{}}
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
      errors={{}}
      values={{}}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  );

  const instance = wrapper.instance();
  instance.pages.forEach((page, index) => {
    test(`page ${index}`, () => {
      const div = document.createElement('div');
      ReactDOM.render(page.render(), div);
    });
  });
});

describe('pages validity', () => {
  const mkWrapper = (errors) => shallow(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      handleSubmit={() => {}}
      errors={errors}
      values={{}}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  );

  const mkTest = ({ testName, errors, pageIndex, expectedValidity }) => {
    test(testName, () => {
    const instance = mkWrapper(errors).instance();
    const page = instance.pages[pageIndex];

    expect(page.valid()).toBe(expectedValidity);
    });
  };

  const tests = [
    { 
      testName: 'credentials page is valid when it should be',
      errors: {},
      pageIndex: 0,
      expectedValidity: true,
    },
    {
      testName: 'cluster name page is valid when it should be',
      errors: {},
      pageIndex: 1,
      expectedValidity: true,
    },
    {
      testName: 'email page is valid when it should be',
      errors: {},
      pageIndex: 2,
      expectedValidity: true,
    },
    {
      testName: 'credentials page is invalid when it should be',
      errors: { awsSecrectAccessKey: 'blank' },
      pageIndex: 0,
      expectedValidity: false,
    },
    {
      testName: 'credentials page is invalid when it should be',
      errors: { awsAccessKeyId: 'blank' },
      pageIndex: 0,
      expectedValidity: false,
    },
    {
      testName: 'cluster name page is invalid when it should be',
      errors: { clusterName: 'blank' },
      pageIndex: 1,
      expectedValidity: false,
    },
    {
      testName: 'email page is invalid when it should be',
      errors: { email: 'not_valid' },
      pageIndex: 2,
      expectedValidity: false,
    },
  ];

  tests.forEach(mkTest);
});

it('#blurEmailField() blurs the email field', () => {
  const wrapper = mount(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={2}
      handleSubmit={() => {}}
      errors={{}}
      values={{}}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  );
  const instance = wrapper.instance();
  const inputEl = wrapper.find(ClusterFormInput).get(0).inputEl;
  expect(inputEl === document.activeElement).toBe(true);

  instance.blurEmailField();

  expect(inputEl === document.activeElement).toBe(false);
});

it('#blurEmailField() does not error if the email page is not displayed', () => {
  const wrapper = mount(
    <ClusterLaunchForm
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      handleSubmit={() => {}}
      errors={{}}
      values={{}}
      onShowNextPage={() => {}}
      onShowPreviousPage={() => {}}
    />
  );
  const instance = wrapper.instance();

  expect(() => instance.blurEmailField()).not.toThrow();
});
