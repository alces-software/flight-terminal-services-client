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
import { connect } from 'react-redux';

import AvailableQueueCard from './AvailableQueueCard';

const propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // availableQueues: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //     description: PropTypes.string.isRequired,
  //   })
  // ).isRequired,
};

const AvailableQueues = ({ availableQueues, cluster }) => {
  const { clusterName } = cluster.attributes;
  // const descriptions = queueDescriptors.map(descriptor => (
  //   <div key={descriptor.name}>
  //     <strong>{descriptor.name}</strong>
  //     <p>{descriptor.description}</p>
  //     <Button onClick={() => dispatch(showModal(descriptor, 'CREATE'))}>
  //       Create queue
  //     </Button>
  //     <Button onClick={() => dispatch(showModal(descriptor, 'MODIFY'))}>
  //       Modify queue
  //     </Button>
  //   </div>
  // ));

  return (
    <div>
      <p>
        Your cluster <em>{clusterName}</em> supports the following queues:
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
