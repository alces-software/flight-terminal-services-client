/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { StandardModal } from 'flight-common';

import tokenOnlyCopy from '../copy/welcomeMessageTokenOnly.md';
import awsCredentialsAllowedCopy from '../copy/welcomeMessageAwsCredentialsAllowed.md';

const propTypes = {
  awsCredentialsAllowed: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

const WelcomeMessageModal = ({ awsCredentialsAllowed, show, onHide }) => {
  const copy = awsCredentialsAllowed ?
    awsCredentialsAllowedCopy :
    tokenOnlyCopy;

  return (
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
};

WelcomeMessageModal.propTypes = propTypes;

export default WelcomeMessageModal;
