/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';

import TokenInput from './TokenInput';

const commonProps = {
  id: "",
  onChange: () => {},
  errors: {},
  values: {},
};

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TokenInput {...commonProps} />, div);
});
