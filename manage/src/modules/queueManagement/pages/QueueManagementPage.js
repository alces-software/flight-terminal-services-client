/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { PageHeading, Section, makeSection } from 'flight-reactware';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import clusters from '../../clusters';
import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import DocsSiteLink from '../../../elements/DocsSiteLink';

import * as actions from '../actions';
import * as selectors from '../selectors';
import QueueCards from '../components/QueueCards';
import QueueManagementFormModal from '../components/QueueManagementFormModal';

const sections = {
  queues: makeSection('Compute queues', 'queues', 'pink', 'cog'),
  about: makeSection('What are compute queues?', 'about-queues', 'blue', 'question'),
};

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }),
  }),
  queues: PropTypes.array.isRequired,
  showingModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

const QueueManagementPage = ({
  cluster,
  queues,
  showingModal,
  toggleModal,
}) => {
  return (
    <Container fluid >
      <PageHeading
        overview="Manage your cluster's compute queues."
        sections={Object.values(sections)}
        title="Compute queue management."
      />
      <Section
        overview="Add, modify and remove your cluster's compute queues."
        section={sections.queues}
        title="Configure your cluster's compute queues."
      >
        <QueueCards
          cluster={cluster}
          queues={queues}
        />
      </Section>
      <Section
        overview="Compute queues allow you to configure and control the
        compute resources available to your cluster."
        section={sections.about}
        title="What are compute queues?"
      >
        <Row>
          <Col>
            <p>
              Lorem ipsum...
            </p>
            <p>
              More information about compute queues can be found on our{' '}
              <DocsSiteLink>documentation site</DocsSiteLink>.  We also have a
              {' '}
              <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
              {' '} available for you to join in and read through.
            </p>
          </Col>
        </Row>
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
      queues: selectors.allQueues,
      showingModal: selectors.showingModal,
    }),
    { toggleModal: actions.toggleModal }
  ),
);

export default enhance(QueueManagementPage);
