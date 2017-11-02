import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const QueueManagementIntro = ({ hostname }) => (
  <div>
    <h4>
      Cluster compute queue management
    </h4>
    <p>
      Your cluster has been configured with a VPN endpoint, which allows you
      to securely access and share resources such as interactive sessions.
    </p>
    <p>
      You can manage your cluster's compute queues by visting the{' '}
      <Link to={`/cluster/${hostname}/queue-management`}>
        queue management page
      </Link>.
    </p>
  </div>
);

QueueManagementIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default QueueManagementIntro;
