import React from 'react';
import { storiesOf } from '@kadira/storybook';

import WelcomeMessageModal from '../components/WelcomeMessageModal';

storiesOf('WelcomeMessageModal', module)
  .add('', () => (
    <WelcomeMessageModal
      show
      onHide={() => {}}
    />
  ));
