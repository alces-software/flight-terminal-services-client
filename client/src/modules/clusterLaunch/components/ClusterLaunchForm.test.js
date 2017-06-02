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
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import ClusterLaunchForm, {
  ClusterLaunchForm as UnconnectedClusterLaunchForm
} from './ClusterLaunchForm';
import ClusterFormInput from './ClusterFormInput';

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
    scheduler: {
      type: "slurm",
      text: "Slurm",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Slurm_Workload_Manager.png/262px-Slurm_Workload_Manager.png",
      tooltip: "This cluster uses the Slurm scheduler",
    },
  },
};

const commonProps = {
  handleSubmit: () => {},
  onCancel: () => {},
  onShowNextPage: () => {},
  onShowPreviousPage: () => {},
  onTokenEntered: () => {},
};

const ReactDOMRender = (component, domEl) => (
  ReactDOM.render(
    <Provider store={store}>
      {component}
    </Provider>,
    domEl
  )
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOMRender(
    <ClusterLaunchForm
      {...commonProps}
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      errors={{}}
      values={{}}
    />,
    div
  );
});

describe('pages render without crashing', () => {
  const wrapper = shallow(
    <UnconnectedClusterLaunchForm
      {...commonProps}
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      errors={{}}
      values={{}}
    />
  );

  const instance = wrapper.instance();
  instance.pages.forEach((page, index) => {
    test(`page ${index}`, () => {
      const div = document.createElement('div');
      ReactDOMRender(page.render(), div);
    });
  });
});

describe('pages validity', () => {
  const mkWrapper = (errors, props) => shallow(
    <UnconnectedClusterLaunchForm
      {...commonProps}
      {...props}
      clusterSpec={clusterSpec}
      currentPageIndex={0}
      errors={errors}
      values={{}}
    />
  );

  const mkTest = ({ testName, errors, pageIndex, props={}, expectedValidity }) => {
    test(testName, () => {
    const instance = mkWrapper(errors, props).instance();
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
      pageIndex: 2,
      expectedValidity: true,
    },
    {
      testName: 'email page is valid when it should be',
      errors: {},
      pageIndex: 3,
      expectedValidity: true,
    },
    {
      testName: 'credentials page is invalid when it should be',
      errors: { launchToken: 'blank' },
      pageIndex: 0,
      expectedValidity: false,
    },
    {
      testName: 'cluster name page is invalid when it should be',
      errors: { clusterName: 'blank' },
      pageIndex: 2,
      expectedValidity: false,
    },
    {
      testName: 'email page is invalid when it should be',
      errors: { email: 'not_valid' },
      pageIndex: 3,
      expectedValidity: false,
    },
  ];

  tests.forEach(mkTest);
});

it('provides an emailRef which can be used to blur the email field', () => {
  let emailRef;
  const wrapper = mount(
    <UnconnectedClusterLaunchForm
      {...commonProps}
      clusterSpec={clusterSpec}
      currentPageIndex={3}
      errors={{}}
      values={{}}
      emailRef={(el) => { emailRef = el; }}
    />
  );
  const inputEl = wrapper.find(ClusterFormInput).get(0).inputEl;
  expect(inputEl === document.activeElement).toBe(true);

  emailRef.blur();

  expect(inputEl === document.activeElement).toBe(false);
});
