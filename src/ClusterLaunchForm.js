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
    () => (
      <Credentials
        id={this.props.clusterSpec.ui.title}
        values={{
          awsAccessKeyId: this.props.values.awsAccessKeyId,
          awsSecrectAccessKey: this.props.values.awsSecrectAccessKey,
        }}
        onChange={this.props.onChange}
      />),
    () => (
      <ClusterName
        id={this.props.clusterSpec.ui.title}
        value={this.props.values.clusterName}
        onChange={this.props.onChange}
      />),
    () => (
      <Email
        id={this.props.clusterSpec.ui.title} 
        value={this.props.values.email}
        onChange={this.props.onChange}
      />),
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
    values: {
      awsAccessKeyId: '',
      awsSecrectAccessKey: '',
      clusterName: '',
      email: '',
    },
  }

  handleFormChange = ({ name, value }) => {
    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
    });
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
        onChange={this.handleFormChange}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.handleShowPreviousPage}
      />
    );
  }
}

export default ClusterLaunchFormContainer;
