import React from 'react';
import { MissingNotice } from 'flight-reactware';

const NoClustersAvailable = () => (
  <MissingNotice title="No clusters are currently available">
    <p>
      Unfortunately, no clusters are currently available for launch.{' '}
      Please visit our <a href="https://community.alces-flight.com">Community
        Support Portal</a> for further help.
    </p>
  </MissingNotice>
);

export default NoClustersAvailable;
