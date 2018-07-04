import React from 'react';

import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

const LoadError = () => (
  <MissingNotice title="Unable to load directory details">
    Unfortunately, the details for the directory service cannot be loaded.
    Please try again, or visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

export default LoadError;
