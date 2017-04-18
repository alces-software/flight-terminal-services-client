/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

import welcomeMessageTokenOnlyCopy from '../copy/welcomeMessageTokenOnly.md';

const WelcomeMessageModal = ({ show, onHide }) => (
  <StandardModal
    title="Welcome to the Alces Flight Launch Service!"
    onHide={onHide}
    show={show}
    bsSize="large"
  >
    { /* eslint-disable react/no-danger */ }
    <div dangerouslySetInnerHTML={{ __html: welcomeMessageTokenOnlyCopy }} />
    { /* eslint-enable react/no-danger */ }
  </StandardModal>
);

WelcomeMessageModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default WelcomeMessageModal;
