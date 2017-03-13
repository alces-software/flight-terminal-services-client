/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import { clusterSpecShape } from './propTypes';
import ClusterLaunchForm from './ClusterLaunchForm';

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
  };

  componentDidMount() {
    this.setState({ errors: this.validate(this.state.values) });
  }

  state = {
    currentPageIndex: 0,
    submitting: false,
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitting: true });
    console.log('this.state.values:', this.state.values);  // eslint-disable-line no-console
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ submitting: false });
        resolve()
      }, 2000);
    });
    return promise;
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
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

export default ClusterLaunchFormContainer;
