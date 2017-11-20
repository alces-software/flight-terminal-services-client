/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { PageHeading, Section, makeSection } from 'flight-reactware';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import clusters from '../../clusters';

import * as actions from '../actions';
import * as selectors from '../selectors';
import AvailableQueues from '../components/AvailableQueues';
import CurrentQueues from '../components/CurrentQueues';
import QueueManagementFormModal from '../components/QueueManagementFormModal';

const sections = {
  currentQueues: makeSection('Current queues', 'current-queues', 'pink', 'cog'),
  availableQueues: makeSection('Available queues', 'about', 'orange', 'book'),
};

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }),
  }),
  showingModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

const QueueManagementPage = ({
  cluster,
  showingModal,
  toggleModal,
}) => {
  const {
    availableComputeQueues: availableQueues,
    currentComputeQueues: currentQueues,
  } = cluster.attributes;

  return (
    <Container>
      <PageHeading
        overview="Manage your cluster's compute queues."
        sections={Object.values(sections)}
        title="Compute queue management."
      />
      <Section
        overview="The currently configured queues for your cluster."
        section={sections.currentQueues}
        title="Current queues."
      >
        <CurrentQueues
          availableQueuesSectionTarget={sections.availableQueues.target}
          cluster={cluster}
          currentQueues={currentQueues}
        />
      </Section>
      <Section
        overview="The available queues for your cluster."
        section={sections.availableQueues}
        title="Available queues."
      >
        <AvailableQueues
          availableQueues={availableQueues}
          cluster={cluster}
        />
      </Section>
      <QueueManagementFormModal
        cluster={cluster}
        isOpen={showingModal}
        toggle={toggleModal}
      />
    </Container>
  );
};

QueueManagementPage.propTypes = propTypes;

const enhance = compose(
  clusters.withCluster,

  branch(
    ({ cluster }) => {
      const features = cluster.attributes.features;
      return !features.hasQueueManagement && !features.hasQueueManangement;
    },
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  ),

  connect(
    createStructuredSelector({
      showingModal: selectors.showingModal,
    }),
    { toggleModal: actions.toggleModal }
  ),
);

export default enhance(QueueManagementPage);
