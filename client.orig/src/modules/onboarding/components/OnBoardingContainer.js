/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { NAME } from '../constants';
import WelcomeMessageModal from './WelcomeMessageModal';

const OnBoardingContainer = ({setWelcomeMessageRead, isWelcomeMessageRead}) => (
  <WelcomeMessageModal
    show={!isWelcomeMessageRead}
    onHide={setWelcomeMessageRead}
  />
);

export default connect(
  state => state[NAME],
  actions,
)(OnBoardingContainer);
