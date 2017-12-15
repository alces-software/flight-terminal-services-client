import React from 'react';
import PropTypes from 'prop-types';

import AccessIntroCard from './AccessIntroCard';

const QueueManagementIntro = ({ hostname }) => (
  <AccessIntroCard
    buttonHref={`/cluster/${hostname}/queue-management`}
    buttonText="Manage compute queues"
    headerText="Cluster compute queue management"
    iconName="cog"
  >
    <p>
      Your cluster has been configured to support management of its compute
      queues through Flight Manage.  You can create, modify and remove compute
      queues by visiting the queue management page.
    </p>
  </AccessIntroCard>
);

QueueManagementIntro.propTypes = {
  hostname: PropTypes.string.isRequired,
};

export default QueueManagementIntro;
