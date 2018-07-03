import React from 'react';
import PropTypes from 'prop-types';

import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../elements/CommunitySiteLink';

const propTypes = {
  hostname: PropTypes.string.isRequired,
};

const LoadError = ({ hostname }) => (
  <MissingNotice title="Unable to load directory details">
    Unfortunately, the details for the directory service cannot be loaded.
    Please try again, or visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

LoadError.propTypes = propTypes;

export default LoadError;
