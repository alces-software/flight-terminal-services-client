/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
    }),
  }),
};

const CurrentQueues = ({ cluster }) => {
  return (
    <div>
      <ul>
        <li>XXX Load current queues from tracon and display here.</li>
        <li>XXX Could have the client or server load it.</li>
        <li>XXX Whichever is chosen needs the cluster auth available.</li>
        <li>XXX Should probably be the server.</li>
      </ul>
    </div>
  );
};

CurrentQueues.propTypes = propTypes;

export default CurrentQueues;
