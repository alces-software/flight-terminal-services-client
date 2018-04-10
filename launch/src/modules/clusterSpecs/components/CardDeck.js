import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ClusterSpecCard from './Card';

const cardDeckPadding = 12;

const propTypes = {
  clusterSpecs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ClusterSpecCardDeck = styled(({ className, clusterSpecs }) => {
  return (
    <div className={className} >
      {
        clusterSpecs.map(clusterSpec => (
          <ClusterSpecCard
            clusterSpec={clusterSpec}
            key={clusterSpec.ui.title}
          />
        ))
      }
    </div>
  );
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  ${ClusterSpecCard} {
    padding-left: ${cardDeckPadding / 2}px;
    padding-right: ${cardDeckPadding / 2}px;
    padding-bottom: ${cardDeckPadding / 2}px;
  }
`;

ClusterSpecCardDeck.propTypes = propTypes;

export default ClusterSpecCardDeck;
