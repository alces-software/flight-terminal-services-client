import React from 'react';
import { storiesOf } from '@kadira/storybook';

import ClusterErrorModal from '../ClusterErrorModal';

storiesOf('ClusterErrorModal', module)
  .add('', () => (
    <ClusterErrorModal
      show
      onHide={() => {}}
      error={{
        exception: `LaunchClusterCommand::LaunchFailed (Error: Invalid key pair name 'aws_ireland'.
          
          ):`
      }}
    />
  ));
