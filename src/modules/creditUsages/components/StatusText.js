import React from 'react';
import PropTypes from 'prop-types';

const StatusText = ({ gracePeriodExpiresAt, status }) => {
  switch (status) {
    case 'CREATE_COMPLETE':
      if (gracePeriodExpiresAt) {
        return <span>Running (grace period active).</span>;
      } else {
        return <span>Running.</span>;
      }
    case 'TERMINATION_IN_PROGRESS':
      return <span>Terminating.</span>;
    case 'TERMINATION_FAILED':
      return <span>Termination failed.</span>;
    case 'TERMINATION_COMPLETE':
      return <span>Terminated.</span>;
    default:
      return <span>Unknown status: {status}.</span>;
  }
};

StatusText.propTypes = {
  gracePeriodExpiresAt: PropTypes.string,
  status: PropTypes.oneOf([
    'CREATE_COMPLETE',
    'TERMINATION_IN_PROGRESS',
    'TERMINATION_FAILED',
    'TERMINATION_COMPLETE',
  ]).isRequired,
};

export default StatusText;
