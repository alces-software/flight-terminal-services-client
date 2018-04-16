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
        compute resources available within your cluster."
        section={sections.about}
        title="What are compute queues?"
      >
        <Row>
          <Col>
            <p>
              With configurable compute queues, you're in control of selecting
              the balance of resources to suit both your HPC workload and your
              budget.  First choose from the available queue resource types:
            </p>
            <ul>
              <li>
                <em>General</em> - a good base-level performance for a variety
                of workloads
              </li>
              <li>
                <em>GPU</em> - access to GPUs for workloads that are tuned for
                GPGPU computation
              </li>
              <li>
                <em>Highmem</em> - larger quantity of RAM per core for
                workloads that require high amounts of memory
              </li>
              <li>
                <em>Balanced</em> - high-level performance with a balanced
                quantity of RAM per core for workloads that are tuned for CPU
                computation
              </li>
            </ul>
            <p>
              Once you've decided on what kind of resources are suitable,
              choose a durability option:
            </p>
            <ul>
              <li>
                <em>Pilot</em> - less powerful resources, intended for
                initially testing out workloads at a small scale (only
                available for general and GPU resource types)
              </li>
              <li>
                <em>Economy</em> - prioritizes cost over availability; workloads
                have a small chance of being interrupted, but resources are
                significantly cheaper to operate
              </li>
              <li>
                <em>Durable</em> - prioritizes availability over cost; workloads
                will never be interrupted, but resources are more expensive to
                operate
              </li>
            </ul>
            <p>
              Once added to your cluster, new queues will become available to
              your cluster job scheduler, allowing you to choose which queue
              suits your workload at job submission time.
            </p>
            <p>
              More information about job schedulers and compute queues can be
              found on our
              {' '}<DocsSiteLink>documentation site</DocsSiteLink>{' '}.
              If you have questions about compute queues, visit our
              {' '}<CommunitySiteLink>Community Support Portal</CommunitySiteLink>{' '}
              where you can pose your query and engage with the rest of the
              Alces Flight community.
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
      const { hasQueueManagement, hasQueueManangement } = cluster.attributes;
      return !hasQueueManagement && !hasQueueManangement;
    },
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  ),

  connect(
    createStructuredSelector({
      queues: selectors.decoratedQueues,
      showingModal: selectors.showingModal,
    }),
    { toggleModal: actions.toggleModal }
  ),
);

export default enhance(QueueManagementPage);
