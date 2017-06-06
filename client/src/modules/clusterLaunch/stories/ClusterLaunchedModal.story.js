import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ClusterLaunchedModal from '../components/ClusterLaunchedModal';

const commonProps = {
  show: true,
  onHide: () => {},
  clusterName: 'clusteryMcClusterFace',
  email: 'me@example.com',
};

storiesOf('ClusterLaunchedModal', module)
  .add('', () => (
    <ClusterLaunchedModal
      {...commonProps}
    />
  ));
