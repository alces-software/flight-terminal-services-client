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
  availableQueuesSectionTarget: PropTypes.string.isRequired,
  // cluster: PropTypes.shape({
  //   attributes: PropTypes.shape({
  //   }),
  // }),
  // computeQueues: PropTypes.arrayOf(PropTypes.shape({
  // })).isRequired,
};

const CurrentQueues = ({
  availableQueuesSectionTarget,
  cluster,
  currentQueues,
}) => {
  const { clusterName } = cluster.attributes;
  if (!currentQueues.length) {
    return (
      <div>
        <p>
          Your cluster <em>{clusterName}</em> does not yet have any compute
          queues configured.  You can{' '}
          <ScrollButton
            href={`#${availableQueuesSectionTarget}`}
            tag="a"
            to={availableQueuesSectionTarget}
          >
            view the available compute queues 
          </ScrollButton>
          {' '}and configure a queue now.  Once you have configured a queue,
          it will be listed here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Row>
        {
          currentQueues.map((queue) => (
            <Col
              key={queue.spec}
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

CurrentQueues.propTypes = propTypes;

export default CurrentQueues;
