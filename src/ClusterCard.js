/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import Card from './Card';

console.log('Card:', Card);  // eslint-disable-line no-console

const clusterSpecShape = PropTypes.shape({
  body: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
};

const ClusterCard = ({ clusterSpec }) => (
  <Card
    subtitle={clusterSpec.subtitle}
    subtitleSize="medium"
    title={clusterSpec.title}
    titleLogoUrl={clusterSpec.logoUrl}
    titleSize="large"
  >
    {clusterSpec.body}
  </Card>
);

ClusterCard.propTypes = propTypes;

export default ClusterCard;
