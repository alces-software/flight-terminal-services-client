import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock } from 'reactstrap';

import { CardTitleBlock } from 'flight-reactware';
import clusterLaunch from '../../clusterLaunch/';

import { clusterSpecShape } from '../propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  showFront: PropTypes.func.isRequired,
};

const CardFront = ({ clusterSpec, showFront }) => (
  <Card>
    <CardBlock>
      <CardTitleBlock
        logoOnRight
        logoSrc={clusterSpec.ui.logoUrl}
        subtitle={clusterSpec.ui.subtitle}
        title={clusterSpec.ui.title}
      />
      <clusterLaunch.Form
        clusterSpec={clusterSpec}
        clusterSpecsFile="default.json"
        onCancel={showFront}
        tenantIdentifier="default"
      />
    </CardBlock>
  </Card>
);

CardFront.propTypes = propTypes;

export default CardFront;
