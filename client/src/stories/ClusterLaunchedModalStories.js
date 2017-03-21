import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ClusterLaunchedModal from '../ClusterLaunchedModal';

storiesOf('ClusterLaunchedModal', module)
  .add('with email', () => (
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      clusterName="clusteryMcClusterFace"
      email="me@example.com"
    />
  ))
  .add('without email', () => (
    <ClusterLaunchedModal
      show
      onHide={() => {}}
      clusterName="mooselooseaboutthishoose"
    />
  ));

