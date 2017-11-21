/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollButton } from 'flight-reactware';
import { Row, Col } from 'reactstrap';

import CurrentQueueCard from './CurrentQueueCard';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      clusterName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  queues: PropTypes.arrayOf(PropTypes.shape({
    spec: PropTypes.shape({
      spec: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
};

const QueueCards = ({ cluster, queues, }) => {
  const { clusterName } = cluster.attributes;
  if (!queues.length) {
    return (
      <div>
        <p>
          Your cluster <em>{clusterName}</em> does not yet have any compute
          queues available for it.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Row>
        {
          queues.map((queue) => (
            <Col
              key={queue.spec.spec}
              md={4}
            >
              <CurrentQueueCard queue={queue} />
            </Col>
          ))
        }
      </Row>
    </div>
  );
};

QueueCards.propTypes = propTypes;

export default QueueCards;
