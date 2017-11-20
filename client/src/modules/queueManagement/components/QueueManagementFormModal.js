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
  queueSpec: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
};

const defaultProps = {
  queueSpec: { name: '', description: '' },
};

const QueueManagementFormModal = ({ cluster, isOpen, toggle, queueSpec }) => {
  const title = (
    <span>
      Compute queue <em>{queueSpec.name}</em> for cluster{' '}
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
        queueSpec={queueSpec}
      />
    </StandardModal>
  );
};

QueueManagementFormModal.propTypes = propTypes;
QueueManagementFormModal.defaultProps = defaultProps;

const enhance = compose(
  connect(
    createStructuredSelector({
      queueSpec: selectors.queueSpec,
    })
  ),
);

export default enhance(QueueManagementFormModal);
