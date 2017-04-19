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

import ClusterErrorModal from './ClusterErrorModal';

it('renders without crashing', () => {
  const error = {
    exception: 'An exception',
  };

  const div = document.createElement('div');
  ReactDOM.render(<ClusterErrorModal show onHide={() => {}} error={error} />, div);
});

it('displays a useful unexpected error message for 500 errors during developemnt', () => {
  const error = {
    status: 500,
    message: 'Internal server error',
    exception: 'NoMethodError',
  };

  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('UnexpectedMessage').dive().find('pre')).toHaveText(error.exception);
});

it('displays an unexpected error message for 500 errors', () => {
  const error = {
    status: 500,
    message: 'Internal server error',
  };

  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('UnexpectedMessage').dive()).toIncludeText('there was an unexpected error');
  expect(wrapper.find('UnexpectedMessage').dive().find('pre')).toBeEmpty();
});

it('displays an error message when the token cannot be found', () => {
  const error = {
    details: {
      token: ['token not found'],
    },
  };
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("we haven't been able to find the token entered");
});

it('displays an error message when the token has already been used', () => {
  const error = {
    details: {
      token: ['token has already been used'],
    },
  };
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("token you have entered has already been used");
});

it('displays an error message when the token cannot launch the spec', () => {
  const error = {
    details: {
      token: ['token cannot launch cluster spec'],
    },
  };
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("cannot be used with the cluster");
});

it('displays an error message when the cluster name is currently taken', () => {
  const error = {
    details: {
      cluster_name: ['taken'],
    },
  };
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("The cluster name you have chosen is already in use");
});

it('displays an error message when the AWS credentials are invalid', () => {
  const error = {
    details: {
      credentials: ['invalid credentials'],
    },
  };
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("AWS credentials you have provided are not valid");
});
