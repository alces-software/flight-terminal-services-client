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
import { Container, Row, Col } from 'reactstrap';

import clusters from '../../clusters';

import QueueManagement from '../components/QueueManagement';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
      // queueManagement: PropTypes.shape({
      // }).isRequired,
    }),
  }),
};

const QueueManagementPage = ({ cluster }) => {
  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <h2>
              Compute queues for <em>{cluster.attributes.clusterName}</em>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p>
              You can use this page to manage the compute queues for your
              cluster.
            </p>
          </Col>
        </Row>
      </Container>
      <QueueManagement cluster={cluster} />
    </div>
  );
};

QueueManagementPage.propTypes = propTypes;

const enhance = compose(
  clusters.withCluster,

  // branch(
  //   ({ cluster }) => !cluster.attributes.hasQueueManagement,
  //   renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  // )
);

export default enhance(QueueManagementPage);
