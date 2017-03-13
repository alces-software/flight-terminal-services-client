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
    {
      render: () => (
        <Credentials
          id={this.props.clusterSpec.ui.title}
          errors={{
            awsAccessKeyId: this.props.errors.awsAccessKeyId,
            awsSecrectAccessKey: this.props.errors.awsSecrectAccessKey,
          }}
          values={{
            awsAccessKeyId: this.props.values.awsAccessKeyId,
            awsSecrectAccessKey: this.props.values.awsSecrectAccessKey,
          }}
          onChange={this.props.onChange}
        />),
      valid: () => (
        !this.props.errors.awsAccessKeyId && !this.props.errors.awsSecrectAccessKey
      ),
    },
    {
      render: () => (
        <ClusterName
          id={this.props.clusterSpec.ui.title}
          error={this.props.errors.clusterName}
          value={this.props.values.clusterName}
          onChange={this.props.onChange}
        />),
      valid: () => !this.props.errors.clusterName,
    },
    {
      render: () => (
        <Email
          id={this.props.clusterSpec.ui.title} 
          error={this.props.errors.email}
          value={this.props.values.email}
          onChange={this.props.onChange}
        />),
      valid: () => !this.props.errors.email,
    },
  ];

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

  componentDidMount() {
    this.setState({ errors: this.validate(this.state.values) });
  }

  state = {
    currentPageIndex: 0,
    values: {
      awsAccessKeyId: '',
      awsSecrectAccessKey: '',
      clusterName: '',
      email: '',
    },
    errors: {
      awsAccessKeyId: null,
      awsSecrectAccessKey: null,
      clusterName: null,
      email: null,
    }
  }

  handleFormChange = ({ name, value }) => {
    const errors = this.validate({
      ...this.state.values,
      [name]: value,
    });

    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
      errors: errors,
    });
  }

  handleShowNextPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex + 1 });
  }

  handleShowPreviousPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
  }

  validate(allValues) {
    const errors = {};

    if (allValues.awsAccessKeyId == null ||
      allValues.awsAccessKeyId.length < 16
    ) {
      errors.awsAccessKeyId = 'error';
    }

    if (allValues.awsSecrectAccessKey == null ||
      allValues.awsSecrectAccessKey.length < 16
    ) {
      errors.awsSecrectAccessKey = 'error';
    }

    if (allValues.clusterName == null || allValues.clusterName.length < 1) {
      errors.clusterName = 'error';
    }

    return errors;
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
