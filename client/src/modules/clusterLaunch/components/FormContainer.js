/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import validatorUtils from 'validator';
import { connect } from 'react-redux';

import { clusterSpecShape } from '../../../modules/clusterSpecs/propTypes';
// import * as analytics from '../../../utils/analytics';
import tokens from '../../../modules/tokens';

import ErrorModal from './ErrorModal';
import ClusterLaunchForm from './Form';
import LaunchedModal from './LaunchedModal';

const clusterNameRe = /^[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]$/;
const oneCharClusterNameRe = /^[a-zA-Z0-9]$/;

function strip(string) {
  return string.replace(/^ */, '').replace(/ *$/, '');
}

function validate(allValues, state) {
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
  if (allValues.clusterName) {
    if (allValues.clusterName.length > 1 && !clusterNameRe.test(allValues.clusterName)) {
      errors.clusterName = 'format';
    } else if (allValues.clusterName.length <= 1 && !oneCharClusterNameRe.test(allValues.clusterName)) {
      errors.clusterName = 'format';
    }
  }

  const email = allValues.email;
  const emailNotGiven = email == null || email.length < 1;
  const tokenAssignedTo = state.token == null ?
    null :
    state.token.attributes.assignedTo;

  if (emailNotGiven && tokenAssignedTo != null) {
    // Validate the email assigned to the token.
    if (!validatorUtils.isEmail(tokenAssignedTo)) {
      errors.email = 'invalid';
    }
  } else {
    // Validate the entered email.
    if (emailNotGiven) {
      errors.email = 'blank';
    } else if (!validatorUtils.isEmail(allValues.email)) {
      errors.email = 'invalid';
    }
  }

  return errors;
}

class ClusterLaunchFormContainer extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    clusterSpecsFile: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    tenantIdentifier: PropTypes.string,
  };

  // eslint-disable-next-line react/sort-comp
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
      clusterName: undefined,
      email: undefined,
      launchToken: undefined,
    },
    modalProps: {
      clusterName: undefined,
      email: undefined,
      error: undefined,
      title: undefined,
    },
    token: undefined,
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      errors: validate(this.state.values, this.state),
      values: {
        ...this.state.values,
        selectedLaunchOptionIndex: this.defaultLaunchOptionIndex(),
      }
    });
  }

  defaultLaunchOptionIndex() {
    return this.props.clusterSpec.launchOptions.defaultOptionIndex;
  }

  handleFormChange = ({ name, value }) => {
    const errors = validate({
      ...this.state.values,
      [name]: value,
    }, this.state);

    if (name === 'launchToken') {
      value = strip(value);
    }

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
        tenant: {
          identifier: this.props.tenantIdentifier,
        },
        token: {
          name: this.state.values.launchToken,
        },
        clusterSpec: {
          name: this.props.clusterSpec.ui.title,
          file: this.props.clusterSpecsFile,
        },
        clusterLaunch: {
          name: this.state.values.clusterName || this.state.values.launchToken,
          email: this.state.values.email || this.state.token.attributes.assignedTo,
          selectedLaunchOptionIndex: this.state.values.selectedLaunchOptionIndex,
        },
      })
    });
  }

  handleSuccessfulLaunch(json) {
    // analytics.clusterLaunchAccepted(this.props.clusterSpec);
    const errors = validate(this.initialValues, this.state);
    this.setState({
      submitting: false,
      values: {
        ...this.initialValues,
        selectedLaunchOptionIndex: this.defaultLaunchOptionIndex(),
      },
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
    // analytics.clusterLaunchRejected(this.props.clusterSpec, json);
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
    this.blurEmailField();
    this.setState({ submitting: true });

    // analytics.clusterLaunchRequested(this.props.clusterSpec);
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

  handleTokenEntered = () => {
    this.props.dispatch(tokens.actions.loadToken(this.state.values.launchToken))
      .then((response) => {
        if (response.error) {
          return Promise.reject(response);
        }
        this.setState({ token: response.payload }, () => {
          this.setState({
            errors: validate(this.state.values, this.state)
          });
        });
      })
      .catch((error) => {
        this.setState({
          modalProps: {
            error,
            title: 'Verifying your launch token has failed',
          },
          showErrorModal: true,
        });
      });
  }

  blurEmailField() {
    if (this.emailInput) { this.emailInput.blur() ; }
  }

  render() {
    return (
      <div>
        <ErrorModal
          {...this.state.modalProps}
          isOpen={this.state.showErrorModal}
          toggle={this.hideModal}
        />
        <LaunchedModal
          {...this.state.modalProps}
          isOpen={this.state.showLaunchedModal}
          toggle={this.hideModal}
        />
        <ClusterLaunchForm
          {...this.state}
          {...this.props}
          emailRef={(el) => { this.emailInput = el; }}
          // eslint-disable-next-line react/jsx-handler-names
          handleSubmit={this.handleSubmit}
          onCancel={this.props.onCancel}
          onChange={this.handleFormChange}
          onShowNextPage={this.handleShowNextPage}
          onShowPreviousPage={this.handleShowPreviousPage}
          onTokenEntered={this.handleTokenEntered}
          tokenName={this.state.values.launchToken}
        />
      </div>
    );
  }
}

export default connect()(ClusterLaunchFormContainer);
