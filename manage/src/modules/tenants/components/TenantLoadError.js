/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import { identifier } from '../selectors';

const propTypes = {
  tenantIdentifier: PropTypes.string.isRequired,
};

const TenantLoadError = ({ tenantIdentifier }) => (
  <MissingNotice title="Unable to load tenant">
    Unfortunately, the tenant <em>{tenantIdentifier}</em> cannot be loaded.
    Please check the tenant name and try again.  Please visit our{' '}
    <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
    {' '}for further help.
  </MissingNotice>
);

TenantLoadError.propTypes = propTypes;

export default connect(createStructuredSelector({
  tenantIdentifier: identifier,
}))(TenantLoadError);
