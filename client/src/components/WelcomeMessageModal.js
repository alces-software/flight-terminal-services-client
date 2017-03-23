/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

import welcomeMessageCopy from '../copy/welcomeMessage.md';

const WelcomeMessageModal = ({ show, onHide }) => (
  <StandardModal
    title="Welcome to Flight Launch!"
    onHide={onHide}
    show={show}
    bsSize="large"
  >
    { /* eslint-disable react/no-danger */ }
    <div dangerouslySetInnerHTML={{ __html: welcomeMessageCopy }} />
    { /* eslint-enable react/no-danger */ }
  </StandardModal>
);

WelcomeMessageModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default WelcomeMessageModal;
