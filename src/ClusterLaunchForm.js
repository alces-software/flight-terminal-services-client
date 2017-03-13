/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon } from 'flight-common';

import { clusterSpecShape } from './propTypes';
import Credentials from './ClusterLaunchCredentials';
import ClusterName from './ClusterLaunchClusterName';
import Email from './ClusterLaunchEmail';
import MultiPageForm from './MultiPageForm';

export class ClusterLaunchForm extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    currentPageIndex: PropTypes.number.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onShowNextPage: PropTypes.func.isRequired,
    onShowPreviousPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    handleSubmit: (event) => {
      alert('XXX Implement the backend');
      event.preventDefault();
    }
  }

  pages = [
    () => <Credentials id={this.props.clusterSpec.ui.title} />,
    () => <ClusterName id={this.props.clusterSpec.ui.title} />,
    () => <Email id={this.props.clusterSpec.ui.title} />,
  ]

  render() {
    return (
      <MultiPageForm
        className="ClusterLaunchForm"
        currentPageIndex={this.props.currentPageIndex}
        handleSubmit={this.props.handleSubmit}
        pages={this.pages}
        submitButtonContent={<span>Launch{' '}<Icon name="plane" /></span>}
        onShowNextPage={this.props.onShowNextPage}
        onShowPreviousPage={this.props.onShowPreviousPage}
      />
    );
  }
}

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
  };

  state = {
    currentPageIndex: 0,
  }

  handleShowNextPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex + 1 });
  }

  handleShowPreviousPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
  }


  render() {
    return (
      <ClusterLaunchForm
        {...this.state}
        {...this.props}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.handleShowPreviousPage}
      />
    );
  }
}

export default ClusterLaunchFormContainer;
