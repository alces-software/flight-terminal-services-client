/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { PropTypes } from 'react';

export const clusterSpecShape = PropTypes.shape({
  ui: PropTypes.shape({
    body: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  fly: PropTypes.shape({
    args: PropTypes.array,
    parameterDirectoryOverrides: PropTypes.object.isRequired,
  }),
});
