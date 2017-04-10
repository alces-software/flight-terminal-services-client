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

function validate(allValues, { useLaunchToken }) {
  const errors = {};

  if ((!useLaunchToken && allValues.awsAccessKeyId == null) ||
    allValues.awsAccessKeyId.length < 16
  ) {
    errors.awsAccessKeyId = 'error';
  }

  if ((!useLaunchToken && allValues.awsSecrectAccessKey == null) ||
    allValues.awsSecrectAccessKey.length < 16
  ) {
    errors.awsSecrectAccessKey = 'error';
  }

  if ((useLaunchToken && allValues.launchToken == null) ||
    allValues.launchToken.length < 5
  ) {
    errors.launchToken = 'error';
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
    const useLaunchToken = this.state.useLaunchToken;
    this.setState({ errors: validate(this.state.values, { useLaunchToken }) });
  }

  initialValues = {
    awsAccessKeyId: '',
    awsSecrectAccessKey: '',
    clusterName: '',
    email: '',
    launchToken: '',
  }

  state = {
    currentPageIndex: 0,
    showErrorModal: false,
    showLaunchedModal: false,
    submitting: false,
    values: this.initialValues,
    useLaunchToken: true,
    errors: {
      awsAccessKeyId: null,
      awsSecrectAccessKey: null,
      clusterName: null,
      email: null,
      launchToken: null,
    },
    modalProps: {
      clusterName: null,
      cloudformationUrl: null,
    }
  }

  handleFormChange = ({ name, value }) => {
    const useLaunchToken = this.state.useLaunchToken;
    const errors = validate({
      ...this.state.values,
      [name]: value,
    }, { useLaunchToken });

    this.setState({
      values: {
        ...this.state.values,
        [name]: value,
      },
      errors: errors,
    });
  }

  sendLaunchRequest() {
    let credentials;
    if (this.state.useLaunchToken) {
      credentials = { token: this.state.values.launchToken };
    } else {
      credentials = {
        access_key: this.state.values.awsAccessKeyId,
        secret_key: this.state.values.awsSecrectAccessKey,
      };
    }

    return fetch('/clusters/launch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clusterSpec: {
          ...this.props.clusterSpec.fly,
          meta: {
            title: this.props.clusterSpec.ui.title,
            titleLowerCase: this.props.clusterSpec.ui.titleLowerCase,
          },
        },
        clusterLaunch: {
          name: this.state.values.clusterName,
          email: this.state.values.email,
          ...credentials,
        },
      })
    })
  }

  handleSuccessfulLaunch(json) {
    analytics.clusterLaunchAccepted(this.props.clusterSpec);
    const useLaunchToken = this.state.useLaunchToken;
    const errors = validate(this.initialValues, { useLaunchToken });
    this.setState({
      submitting: false,
      values: this.initialValues,
      currentPageIndex: 0,
      errors: errors,
      modalProps: {
        clusterName: json.cluster_name,
        cloudformationUrl: json.cloudformation_url,
        email: json.email,
      },
      showLaunchedModal: true,
    });
  }

  handleFailedLaunch(json) {
    analytics.clusterLaunchRejected(this.props.clusterSpec, json);
    this.setState({
      modalProps: {
        error: json
      },
      showErrorModal: true,
      submitting: false,
    });
  }

  handleUnexpectedError = (exception) => {
    let message;
    if (exception.message) {
      message = exception.message;
    } else {
      message = exception.toString();
    }
    this.setState({
      submitting: false,
      modalProps: {
        error: {
          unexpected: message,
        },
      },
      showErrorModal: true,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.launchForm.blurEmailField();
    this.setState({ submitting: true });

    analytics.clusterLaunchRequested(this.props.clusterSpec);
    return this.sendLaunchRequest()
      .then((response) => {
        return response.json()
          .then((json) => {
            if (response.ok) {
              return this.handleSuccessfulLaunch(json);
            } else {
              return this.handleFailedLaunch(json);
            }
          });
      })
      .catch(this.handleUnexpectedError);
  }

  handleShowNextPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex + 1 });
  }

  handleShowPreviousPage = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
  }

  handleToggleUseLaunchToken = () => {
    this.setState({ useLaunchToken: !this.state.useLaunchToken });
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
          onToggleUseLaunchToken={this.handleToggleUseLaunchToken}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default ClusterLaunchFormContainer;
