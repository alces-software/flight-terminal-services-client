/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';

import * as actions from '../actions';
import * as selectors from '../selectors';
import AvailableQueues from './AvailableQueues';
import CurrentQueues from './CurrentQueues';
import QueueManagementFormModal from './QueueManagementFormModal';
import { queueDescriptors } from '../data/queueDescriptors';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      // clusterName: PropTypes.string.isRequired,
      // queueManagement: PropTypes.shape({
      // }).isRequired,
    }),
  }),
};

const QueueManagement = ({ cluster, showingModal, toggleModal }) => {
  return (
    <div>
      <AvailableQueues queueDescriptors={queueDescriptors} />
      <CurrentQueues cluster={cluster} />
      <QueueManagementFormModal
        cluster={cluster}
        isOpen={showingModal}
        toggle={toggleModal}
      />
    </div>
  );
};

QueueManagement.propTypes = propTypes;


const enhance = compose(
  connect(
    createStructuredSelector({
      showingModal: selectors.showingModal,
    }),
    { toggleModal: actions.toggleModal }
  ),
);

export default enhance(QueueManagement);
