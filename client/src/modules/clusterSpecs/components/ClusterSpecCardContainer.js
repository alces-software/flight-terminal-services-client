/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import { clusterSpecShape } from '../propTypes';
import ClusterSpecCard from './ClusterSpecCard';

export default class ClusterSpecCardContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
  };

  state = {
    isFlipped: false,
  }

  showBack = () => {
    this.setState({ isFlipped: true });
  }

  showFront = () => {
    this.setState({ isFlipped: false });
  }

  onKeyDown = (e) => {
    if (this.state.isFlipped && e.keyCode === 27) {
      this.showFront();
    }
  }

  render() {
    return (
      <ClusterSpecCard
        clusterSpec={this.props.clusterSpec}
        flipped={this.state.isFlipped}
        onKeyDown={this.onKeyDown}
        showBack={this.showBack}
        showFront={this.showFront}
      />
    );
  }
}
