import React from 'react';
import PropTypes from 'prop-types';

const CardStatusText = ({ current, modification, status }) => {
  switch (status) {
    case 'CREATE_IN_PROGRESS':
      return (
        <span>
          This queue is currently being configured by your cluster.  When
          available, it will run {modification.desired} nodes, with a
          minimum of {' '}{modification.min} and a maximum of
          {' '}{modification.max}.
        </span>
      );

    case 'MODIFY_IN_PROGRESS':
      return (
        <span>
          This queue is available to your cluster and is currently being
          reconfigured.  When complete, it will run
          {' '}{modification.desired} nodes with a minimum of
          {' '}{modification.min} and a maximum of
          {' '}{modification.max}.
        </span>
      );

    case 'CREATE_COMPLETE':
      return (
        <span>
          This queue is available to your cluster.  It is running
          {' '}{current.current} nodes with a minimum of {current.min} and a
          maximum of {' '}{current.max}.
        </span>
      );

    case 'UNCONFIGURED':
      return (
        <span>
          This queue has not been added to your cluster.  To add it to your
          cluster, click on "Add to cluster" below.
        </span>
      );

    default:
      return <span>Unknown status</span>;
  }
};

CardStatusText.propTypes = {
  current: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  }),
  modification: PropTypes.shape({
    desired: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  }),
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
  ]).isRequired,
};

export default CardStatusText;
