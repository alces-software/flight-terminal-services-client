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
  .add('with cloudformationUrl', () => (
    <ClusterLaunchedModal
      {...commonProps}
      cloudformationUrl="https://eu-west-1.console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stack/detail?stackId=arn:aws:cloudformation:eu-west-1:700366075446:stack%2FGunboat-Debugging%2F50863940-1a02-11e7-ab6b-500c423e34d2"
    />
  ))
  .add('without cloudformationUrl', () => (
    <ClusterLaunchedModal
      {...commonProps}
    />
  ));

