import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, CardText } from 'reactstrap';

import { CardTitleBlock } from 'flight-reactware';

import { clusterSpecShape } from '../propTypes';

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  onClick: PropTypes.func.isRequired,
};

const CardFront = ({ clusterSpec, onClick }) => (
  <Card onClick={onClick} >
    <CardBlock>
      <CardTitleBlock
        logoOnRight
        logoSrc={clusterSpec.ui.logoUrl}
        subtitle={clusterSpec.ui.subtitle}
        title={clusterSpec.ui.title}
      />
      <CardText>XXX Add a form here</CardText>
    </CardBlock>
  </Card>
);

CardFront.propTypes = propTypes;

export default CardFront;
