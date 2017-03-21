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

  expect(wrapper.find('pre')).toHaveText(error.exception);
});
