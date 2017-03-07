/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import Blurb from './Blurb';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Blurb />, div);
});
