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

const error = {
  exception: 'An exception',
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ClusterErrorModal show onHide={() => {}} error={error} />, div);
});

it('displays the exception message', () => {
  const wrapper = shallow(
    <ClusterErrorModal show onHide={() => {}} error={error} />
  );

  expect(wrapper.find('ExceptionMessage').dive().find('pre')).toHaveText(error.exception);
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

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("we haven't been able to find that token");
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

  expect(wrapper.find('DetailsMessage').dive()).toIncludeText("token has already been used");
});
