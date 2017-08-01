import React from 'react';
import PropTypes from 'prop-types';
import FlipCard from 'react-flipcard';
import styled from 'styled-components';
import { compose, withState, withHandlers } from 'recompose';

import { clusterSpecShape } from '../propTypes';
import CardBack from './CardBack';
import CardFront from './CardFront';

const withStyles = (...args) => (Component) => styled(Component)(...args);

const propTypes = {
  className: PropTypes.string.isRequired,
  clusterSpec: clusterSpecShape.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  showBack: PropTypes.func.isRequired,
  showFront: PropTypes.func.isRequired,
};

const ClusterSpecCard = ({ className, clusterSpec, isFlipped, onKeyDown, showBack, showFront }) => (
  <div className={className} >
    <FlipCard
      disabled
      flipped={isFlipped}
      onKeyDown={onKeyDown}
    >
      <CardFront
        clusterSpec={clusterSpec}
        onClick={showBack}
      />
      <CardBack
        clusterSpec={clusterSpec}
        onClick={showFront}
      />
    </FlipCard>
  </div>
);

ClusterSpecCard.propTypes = propTypes;

const cardHeight = 360;
const cardWidth = 564;

const enhance = compose(
  withStyles`
    .ReactFlipCard,
    .ReactFlipCard__Front,
    .ReactFlipCard__Back {
      box-sizing: border-box;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
    }

    .card {
      height: ${cardHeight}px;
    }
  `,

  withState('isFlipped', 'setFlipped', false),
  withHandlers({
    showFront: ({ setFlipped }) => () => setFlipped(false),
    showBack: ({ setFlipped }) => () => setFlipped(true),
    onKeyDown: ({ isFlipped, setFlipped }) => (event) => {
      if (isFlipped && event.keyCode === 27) {
        setFlipped(false);
      }
    },
  }),

);

export default enhance(ClusterSpecCard);
