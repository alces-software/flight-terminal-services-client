/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import AvailableQueueCard from './AvailableQueueCard';

const propTypes = {
  availableQueues: PropTypes.object.isRequired,
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }),
  }),
};

const AvailableQueues = ({ availableQueues, cluster }) => {
  const { clusterName } = cluster.attributes;
  return (
    <div>
      <p>
        The queues supported by <em>{clusterName}</em> are shown below.  To
        configure a queue for your cluster, click on the queue's "Configure"
        button, select the desired, minimum and maximum nodes that the queue
        should have and then click "Add to cluster".
      </p>
      <Row>
        {
          Object.keys(availableQueues).map((queueSpec) => (
            <Col
              key={queueSpec}
              md={4}
            >
              <AvailableQueueCard
                queue={availableQueues[queueSpec]}
                queueName={queueSpec}
              />
            </Col>
          ))
        }
      </Row>
    </div>
  );
};

AvailableQueues.propTypes = propTypes;

export default AvailableQueues;
