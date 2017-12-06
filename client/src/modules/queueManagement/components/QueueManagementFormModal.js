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
  isCreating: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  queue: PropTypes.shape({
    spec: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }),
  toggle: PropTypes.func.isRequired,
};

const defaultProps = {
  queue: {
    spec: { name: '' },
  },
};

const QueueManagementFormModal = ({
  cluster,
  isCreating,
  isOpen,
  toggle,
  queue,
}) => {
  const clusterName = cluster.attributes.clusterName;
  let title;
  if (isCreating) {
    title = (
      <span>
        Add queue <em>{queue.spec.name}</em> to <em>{clusterName}</em>.
      </span>
    );
  } else {
    title = (
      <span>
        Modify queue <em>{queue.spec.name}</em> on {' '}
        <em>{clusterName}</em>.
      </span>
    );
  }

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
        queue={queue}
      />
    </StandardModal>
  );
};

QueueManagementFormModal.propTypes = propTypes;
QueueManagementFormModal.defaultProps = defaultProps;

const enhance = compose(
  connect(
    createStructuredSelector({
      queue: selectors.editingQueue,
      isCreating: selectors.isCreatingQueue,
    })
  ),
);

export default enhance(QueueManagementFormModal);
