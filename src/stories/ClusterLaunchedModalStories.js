import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ClusterLaunchedModal from '../ClusterLaunchedModal';

storiesOf('ClusterLaunchedModal', module)
  .add('first', () => (
    <ClusterLaunchedModal show />
  ));

