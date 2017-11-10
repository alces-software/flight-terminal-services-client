import React from 'react';
import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

const NoClustersAvailable = () => (
  <MissingNotice title="No clusters are currently available">
    <p>
      Unfortunately, no clusters are currently available for launch.
      Please visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink> for
      further help.
    </p>
  </MissingNotice>
);

export default NoClustersAvailable;
