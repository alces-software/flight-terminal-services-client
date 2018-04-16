/*=============================================================================
 * Copyright (C) 2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';

import { MissingNotice } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      isSolo: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

const ManagementUnsupported = ({ cluster }) => {
  if (cluster.attributes.isSolo) {
    return (
      <MissingNotice title="Management of solo clusters is not supported">
        Flight Manage does not currently support managing solo clusters.  If
        there is some aspect of your cluster life-cycle that you think Flight
        Manage could help with, please visit our{' '}
        <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
        {' '}and let us know.
      </MissingNotice>
    );
  }
  return (
    <MissingNotice title="Management of this cluster is not supported">
      Unfortunately, Flight Manage does not support managing this cluster.  If
      you launched the cluster through AWS Marketplace, Flight Manage will be
      able to provide access to the cluster but cannot help manage it.  If the
      cluster was launched with Flight Launch, then please visit our{' '}
      <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
      {' '}for further help.
    </MissingNotice>
  );
};

ManagementUnsupported.propTypes = propTypes;

export default ManagementUnsupported;

