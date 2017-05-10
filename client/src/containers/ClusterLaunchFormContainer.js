/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import validatorUtils from 'validator';

import { clusterSpecShape } from '../utils/propTypes';
import ClusterLaunchForm from '../components/ClusterLaunchForm';
import ClusterLaunchedModal from '../components/ClusterLaunchedModal';
import ClusterErrorModal from '../components/ClusterErrorModal';
import * as analytics from '../utils/analytics';

const clusterNameRe = /^[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]$/;

function validate(allValues) {
  const errors = {};

  if (allValues.launchToken == null || allValues.launchToken.length < 5) {
    errors.launchToken = 'error';
  }

  // If a launch token is provided, we'll default to using that as the cluster
  // name. So we only need to check that there is a value for clusterName when
  // that's not the case.
  if (errors.launchToken != null) {
    if (allValues.clusterName == null || allValues.clusterName.length < 1) {
      errors.clusterName = 'blank';
    }
  }
  if (allValues.clusterName && allValues.clusterName.length > 1 && !clusterNameRe.test(allValues.clusterName)) {
    errors.clusterName = 'format';
  }

  if (allValues.email == null || allValues.email.length < 1) {
    errors.email = 'blank';
  } else if (!validatorUtils.isEmail(allValues.email)) {
    errors.email = 'invalid';
  }

  return errors;
}

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    clusterSpecsFile: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    tenantIdentifier: PropTypes.string,
  };

  componentDidMount() {
    this.setState({
      errors: validate(this.state.values),
    });
  }

  initialValues = {
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
    errors: {
      clusterName: null,
      email: null,
      launchToken: null,
    },
    modalProps: {
      clusterName: null,
      email: null,
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
        clusterSpec: {
          name: this.props.clusterSpec.ui.title,
          file: this.props.clusterSpecsFile,
          tenantIdentifier: this.props.tenantIdentifier,
        },
        clusterLaunch: {
          name: this.state.values.clusterName || this.state.values.launchToken,
          email: this.state.values.email,
          token: this.state.values.launchToken,
        },
      })
    })
  }

  handleSuccessfulLaunch(json) {
    analytics.clusterLaunchAccepted(this.props.clusterSpec);
    const errors = validate(this.initialValues);
    this.setState({
      submitting: false,
      values: this.initialValues,
      currentPageIndex: 0,
      errors: errors,
      modalProps: {
        clusterName: json.cluster_name,
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
