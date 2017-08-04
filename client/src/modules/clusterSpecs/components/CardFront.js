import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, CardBlock, CardText } from 'reactstrap';

import { CardTitleBlock } from 'flight-reactware';

import CardOverlay, { ReactwareCardOverlay } from './CardOverlay';
import FooterIcons from './FooterIcons';
import { clusterSpecShape } from '../propTypes';

const cardTextHeight = 175;

const propTypes = {
  clusterSpec: clusterSpecShape.isRequired,
  showBack: PropTypes.func.isRequired,
};

const CardFront = styled(({ className, clusterSpec, showBack }) => (
  <Card
    className={className}
    onClick={showBack}
  >
    <CardBlock>
      <CardTitleBlock
        logoOnRight
        logoSrc={clusterSpec.ui.logoUrl}
        subtitle={clusterSpec.ui.subtitle}
        title={clusterSpec.ui.title}
      />
      <CardText>{clusterSpec.ui.body}</CardText>
      <FooterIcons clusterSpec={clusterSpec} />
    </CardBlock>
    <CardOverlay showLaunchForm={showBack} />
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
