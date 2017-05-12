/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import { clusterSpecShape } from '../utils/propTypes';
import ClusterSpecCard from '../components/ClusterSpecCard';

export default class ClusterSpecCardContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    clusterSpecsFile: PropTypes.string.isRequired,
    tenantIdentifier: PropTypes.string,
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
        clusterSpecsFile={this.props.clusterSpecsFile}
        flipped={this.state.isFlipped}
        onKeyDown={this.onKeyDown}
        showBack={this.showBack}
        showFront={this.showFront}
        tenantIdentifier={this.props.tenantIdentifier}
      />
    );
  }
}
