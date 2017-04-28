/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

import copy from '../copy/welcomeMessageTokenOnly.md';

const propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

const WelcomeMessageModal = ({ show, onHide }) => (
  <StandardModal
    title="Welcome to the Alces Flight Launch Service!"
    onHide={onHide}
    show={show}
    bsSize="large"
  >
    { /* eslint-disable react/no-danger */ }
    <div dangerouslySetInnerHTML={{ __html: copy }} />
    { /* eslint-enable react/no-danger */ }
  </StandardModal>
);


WelcomeMessageModal.propTypes = propTypes;

export default WelcomeMessageModal;
