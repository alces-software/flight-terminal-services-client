import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, CardBody, CardText } from 'reactstrap';

import { CardTitleBlock } from 'flight-reactware';

import CardOverlay, { ReactwareCardOverlay } from './CardOverlay';
import FooterIcons from './FooterIcons';
import { clusterSpecShape } from '../propTypes';

const cardTextHeight = 175;

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  showLaunchForm: PropTypes.func.isRequired,
};

// XXX Merge into ./Card.js ?
const CardFront = styled(({ className, clusterSpec, showLaunchForm }) => (
  <Card
    className={className}
    onClick={showLaunchForm}
  >
    <CardBody>
      <CardTitleBlock
        logoOnRight
        logoSrc={clusterSpec.ui.logoUrl}
        subtitle={clusterSpec.ui.subtitle}
        title={clusterSpec.ui.title}
      />
      <CardText>{clusterSpec.ui.body}</CardText>
      <FooterIcons clusterSpec={clusterSpec} />
    </CardBody>
    <CardOverlay showLaunchForm={showLaunchForm} />
  </Card>
))`
  .card-text {
    height: ${cardTextHeight}px;
    margin-bottom: 0px;
  }
  &:hover ${ReactwareCardOverlay} {
    opacity: 1;
  }
`;

CardFront.propTypes = propTypes;

export default CardFront;
