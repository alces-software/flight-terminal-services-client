import React from 'react';
import { storiesOf } from '@kadira/storybook';

import WelcomeMessageModal from '../components/WelcomeMessageModal';

storiesOf('WelcomeMessageModal', module)
  .add('token only', () => (
    <WelcomeMessageModal
      awsCredentialsAllowed={false}
      show
      onHide={() => {}}
    />
  ))

  .add('AWS credentials allowed', () => (
    <WelcomeMessageModal
      awsCredentialsAllowed
      show
      onHide={() => {}}
    />
  ));
