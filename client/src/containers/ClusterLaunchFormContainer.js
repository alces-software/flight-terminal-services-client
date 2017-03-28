/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import { clusterSpecShape } from '../utils/propTypes';
import ClusterLaunchForm from '../components/ClusterLaunchForm';
import ClusterLaunchedModal from '../components/ClusterLaunchedModal';
import ClusterErrorModal from '../components/ClusterErrorModal';
import * as analytics from '../utils/analytics';

function validate(allValues) {
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

  if (allValues.email == null || allValues.email.length < 1) {
    errors.email = 'error';
  }

  return errors;
}

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setState({ errors: validate(this.state.values) });
  }

  initialValues = {
    awsAccessKeyId: '',
    awsSecrectAccessKey: '',
    clusterName: '',
    email: '',
  }

  state = {
    currentPageIndex: 0,
    showErrorModal: false,
    showLaunchedModal: false,
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
    const errors = validate({
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

  sendLaunchRequest() {
    return fetch('/clusters/launch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fly: this.props.clusterSpec.fly,
        cluster: {
          name: this.state.values.clusterName,
          email: this.state.values.email,
          access_key: this.state.values.awsAccessKeyId,
          secret_key: this.state.values.awsSecrectAccessKey,
        },
      })
    })
  }

  handleLaunchResponse = (response) => {
    const errors = validate(this.initialValues);
    const newState = {
      submitting: false,
      values: this.initialValues,
      currentPageIndex: 0,
      errors: errors,
    };

    if (response.ok) {
      return response.json()
        .then((json) => {
          analytics.clusterLaunchAccepted(this.props.clusterSpec);
          const modalProps = {
            clusterName: json.cluster_name,
            cloudformationUrl: json.cloudformation_url,
            email: json.email,
          };
          this.setState({
            ...newState,
            modalProps: modalProps,
            showLaunchedModal: true,
          });
        })
        .catch(() => {
          const modalProps = {
            error: 'Unexpected error',
          };
          this.setState({
            ...newState,
            modalProps: modalProps,
            showErrorModal: true,
          });
        });
    } else {
      return response.json().then((json) => {
        analytics.clusterLaunchRejected(this.props.clusterSpec, json);
        const modalProps = {
          error: json
        };
        this.setState({
          ...newState,
          modalProps: modalProps,
          showErrorModal: true,
        });
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.launchForm.blurEmailField();
    this.setState({ submitting: true });

    analytics.clusterLaunchRequested(this.props.clusterSpec);
    return this.sendLaunchRequest()
      .then(this.handleLaunchResponse);
  }

  handleShowNextPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex + 1 });
  }

  handleShowPreviousPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
  }

  hideModal = () => {
    this.setState({ showLaunchedModal: false, showErrorModal: false });
  }

  render() {
    return (
      <div>
        <ClusterErrorModal
          {...this.state.modalProps}
          show={this.state.showErrorModal}
          onHide={this.hideModal}
        />
        <ClusterLaunchedModal
          {...this.state.modalProps}
          show={this.state.showLaunchedModal}
          onHide={this.hideModal}
        />
        <ClusterLaunchForm
          {...this.state}
          {...this.props}
          ref={(el) => { this.launchForm = el; }}
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
