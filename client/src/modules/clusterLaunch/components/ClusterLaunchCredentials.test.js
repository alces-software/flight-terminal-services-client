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

import Credentials from './ClusterLaunchCredentials';

const commonProps = {
  id: "",
  onChange: () => {},
  errors: {},
  values: {},
};

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Credentials {...commonProps} />, div);
});
