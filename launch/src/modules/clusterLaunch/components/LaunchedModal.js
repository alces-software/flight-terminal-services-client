/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { StandardModal } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

import * as actions from '../actions';
import * as selectors from '../selectors';

const propTypes = {
  closeModal: PropTypes.func.isRequired,
  clusterName: PropTypes.string,
  email: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
};

// XXX Rename to SuccessModal or something?
const LaunchedModal = ({ clusterName, email, closeModal, isOpen }) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title="Your Alces Flight Compute HPC cluster is getting ready for take-off"
    toggle={closeModal}
  >
    <p>
      Your Alces Flight Compute HPC cluster, <em>{clusterName}</em>, is in the process of being
      launched.
    </p>
    <p>
      All notices on the status of your cluster will be sent to{' '}
      <a href={`mailto:${email}`}>{email}</a>.  Should you find yourself
      needing help, please visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink>.
    </p>  
    <p>
      Thank you for choosing the Alces Flight Launch service.
    </p>
  </StandardModal>
);

LaunchedModal.propTypes = propTypes;

const enhance = compose(
  connect(createStructuredSelector({
    isOpen: selectors.launchedModal.isModalOpen,
    clusterName: selectors.launchedModal.clusterName,
    email: selectors.launchedModal.email,
  }), {
    closeModal: actions.launchedModal.hide,
  }),
);

export default enhance(LaunchedModal);
