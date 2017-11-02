/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

import { showModal } from '../actions';

const propTypes = {
  queueDescriptors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const AvailableQueues = ({ dispatch, queueDescriptors }) => {
  const descriptions = queueDescriptors.map(descriptor => (
    <div key={descriptor.name}>
      <strong>{descriptor.name}</strong>
      <p>{descriptor.description}</p>
      <Button onClick={() => dispatch(showModal(descriptor, 'CREATE'))}>
        Create queue
      </Button>
      <Button onClick={() => dispatch(showModal(descriptor, 'MODIFY'))}>
        Modify queue
      </Button>
    </div>
  ));

  return (
    <div>
      <p>
        Your cluster supports the following queues:
      </p>
      { descriptions }
    </div>
  );
};

AvailableQueues.propTypes = propTypes;

export default connect()(AvailableQueues);
