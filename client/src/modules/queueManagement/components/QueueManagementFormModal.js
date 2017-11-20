/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { StandardModal } from 'flight-reactware';

import QueueManagementForm from './QueueManagementForm';
import SubmitButton from './SubmitButton';
import * as selectors from '../selectors';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
    }).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  queueDescriptor: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
};

const defaultProps = {
  queueDescriptor: { name: '', description: '' },
};

const QueueManagementFormModal = ({ cluster, isOpen, toggle, queueDescriptor }) => {
  const title = (
    <span>
      Compute queue <em>{queueDescriptor.name}</em> for cluster{' '}
      <em>{cluster.attributes.clusterName}</em>
    </span>
  );

  return (
    <StandardModal
      buttons={<SubmitButton />}
      isOpen={isOpen}
      size="lg"
      title={title}
      toggle={toggle}
    >
      <QueueManagementForm
        cluster={cluster}
        queueDescriptor={queueDescriptor}
      />
    </StandardModal>
  );
};

QueueManagementFormModal.propTypes = propTypes;
QueueManagementFormModal.defaultProps = defaultProps;

const enhance = compose(
  connect(
    createStructuredSelector({
      queueDescriptor: selectors.queueDescriptor,
    })
  ),
);

export default enhance(QueueManagementFormModal);
