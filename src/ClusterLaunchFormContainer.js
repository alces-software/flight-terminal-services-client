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
import ClusterLaunchedModal from './ClusterLaunchedModal';

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
  };

  componentDidMount() {
    this.setState({ errors: this.validate(this.state.values) });
  }

  initialValues = {
    awsAccessKeyId: '',
    awsSecrectAccessKey: '',
    clusterName: '',
    email: '',
  }

  state = {
    currentPageIndex: 0,
    showModal: false,
    submitting: false,
    values: this.initialValues,
    errors: {
      awsAccessKeyId: null,
      awsSecrectAccessKey: null,
      clusterName: null,
      email: null,
    },
    modalProps: {
      clusterName: null,
      cloudformationUrl: null,
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
    // XXX Need to remove focus from email input too.  Calling `blur()` on the
    // input will do the trick.
    event.preventDefault();
    this.setState({ submitting: true });
    console.log('this.state.values:', this.state.values);  // eslint-disable-line no-console
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        const errors = this.validate(this.initialValues);
        this.setState({
          submitting: false,
          showModal: true,
          values: this.initialValues,
          currentPageIndex: 0,
          errors: errors,
          modalProps: {
            clusterName: this.state.values.clusterName,
            cloudformationUrl: 'https://eu-west-1.console.aws.amazon.com/cloudformation/home#/stack/detail?stackId=arn:aws:cloudformation:eu-west-1:700366075446:stack%2Fflight-cluster-bens-bio-cluster-6%2F43147250-08d1-11e7-99ac-500c4240649a',
            email: this.state.values.email,
          },
        });
        resolve();
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

  hideModal = () => {
    this.setState({ showModal: false });
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
      <div>
        <ClusterLaunchedModal
          {...this.state.modalProps}
          show={this.state.showModal}
          onHide={this.hideModal}
        />
        <ClusterLaunchForm
          {...this.state}
          {...this.props}
          onChange={this.handleFormChange}
          onShowNextPage={this.handleShowNextPage}
          onShowPreviousPage={this.handleShowPreviousPage}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default ClusterLaunchFormContainer;
