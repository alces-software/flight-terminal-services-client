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
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { auth, validation as v } from 'flight-reactware';

import collections from '../../../modules/collections';
import launchUsers from '../../../modules/launchUsers';
import tokens from '../../../modules/tokens';
import { clusterSpecShape } from '../../../modules/clusterSpecs/propTypes';

import * as analytics from '../analytics';
import ClusterLaunchForm from './Form';
import { canUseCredits, getClusterName, getDefaultEmail } from '../utils';

const clusterNameRe = /^[a-z0-9][-a-z0-9]*[a-z0-9]$/;
const oneCharClusterNameRe = /^[a-z0-9]$/;

function strip(string) {
  return string.replace(/^ */, '').replace(/ *$/, '');
}

function validate(allValues, state, props) {
  const errors = {};

  if (state.isUsingLaunchToken && (
    allValues.launchToken == null || allValues.launchToken.length < 5)
  ) {
    errors.launchToken = 'error';
  }

  let e;
  // XXX Should this be guarded behind a check for whether we're asking the
  // user for the desired runtime?
  const { desiredRuntime } = allValues;
  e = v.required(desiredRuntime) || v.decimalInteger(desiredRuntime) || v.positiveNumber(desiredRuntime);
  if (e) {
    errors.desiredRuntime = e;
  }

  // XXX Should this be guarded behind a check for whether we're asking the
  // user for a max credit usage?
  const { maxCreditUsage } = allValues;
  e = v.decimalInteger(maxCreditUsage) || v.positiveNumber(maxCreditUsage);
  if (e) {
    errors.maxCreditUsage = e;
  }

  const clusterName = getClusterName(allValues);
  if (clusterName == null || !clusterName.length) {
    errors.clusterName = 'blank';
  } else if (clusterName.length <= 1 && !oneCharClusterNameRe.test(clusterName)) {
    errors.clusterName = 'format';
  } else if (clusterName.length > 1 && !clusterNameRe.test(clusterName)) {
    errors.clusterName = 'format';
  }

  const email = allValues.email;
  const emailNotGiven = email == null || email.length < 1;
  const defaultEmail = getDefaultEmail(props, state);

  if (emailNotGiven && defaultEmail != null) {
    // Validate the email assigned to the token.
    if (!validatorUtils.isEmail(defaultEmail)) {
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
    authToken: PropTypes.string,
    clusterSpec: clusterSpecShape.isRequired,
    clusterSpecsFile: PropTypes.string.isRequired,
    collections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    dispatch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    launchUser: PropTypes.object,
    onError: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    tenantIdentifier: PropTypes.string,
  };

  // eslint-disable-next-line react/sort-comp
  initialValues = {
    clusterName: '',
    desiredRuntime: null,
    email: '',
    launchToken: '',
    maxCreditUsage: null,
    queues: {},
    selectedCollection: undefined,
  }

  state = {
    currentPageIndex: 0,
    isUsingLaunchToken: true,
    submitting: false,
    values: this.initialValues,
    errors: {
      clusterName: undefined,
      email: undefined,
      launchToken: undefined,
    },
    token: undefined,
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      errors: validate(this.state.values, this.state, this.props),
      currentPageIndex: 0,
      isUsingLaunchToken: !canUseCredits(this.props),
      values: {
        ...this.state.values,
        selectedLaunchOptionIndex: this.defaultLaunchOptionIndex(),
      }
    });
  }

  defaultLaunchOptionIndex() {
    return this.props.clusterSpec.launchOptions.defaultOptionIndex;
  }

  handleQueueChange = ({ name, queueName, value }) => {
    this.setState((s) => {
      return {
        ...s,
        values: {
          ...s.values,
          queues: {
            ...s.values.queues,
            [queueName]: {
              ...s.values.queues[queueName] || {},
              [name]: value,
            }
          }
        }
      };
    });
  }

  handleFormChange = ({ name, value }) => {
    const errors = validate({
      ...this.state.values,
      [name]: value,
    }, this.state, this.props);

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
    const selectedCollection = (this.props.collections || [])
      .find(c => c.id === this.state.values.selectedCollection);
    const collectionUrl = selectedCollection == null 
      ? undefined
      : selectedCollection.links.self;
    let authHeaders = {};
    if (this.props.authToken != null) {
      authHeaders = { Authorization: `Bearer ${this.props.authToken}` };
    }
    const email = this.state.values.email ||
      getDefaultEmail(this.props, this.state);
    const tokenParams = {};
    if (this.state.isUsingLaunchToken) {
      tokenParams.token = { 
        name: this.state.values.launchToken,
      };
    }

    return fetch('/clusters/launch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({
        tenant: {
          identifier: this.props.tenantIdentifier,
        },
        ...tokenParams,
        clusterSpec: {
          name: this.props.clusterSpec.ui.title,
          file: this.props.clusterSpecsFile,
        },
        clusterLaunch: {
          collection: collectionUrl,
          email: email,
          name: getClusterName(this.state.values),
          queues: this.state.values.queues,
        },
        payment: {
          maxCreditUsage: this.state.values.maxCreditUsage,
          paymentMethod: this.paymentMethod(),
          runtime: this.state.values.desiredRuntime,
        },
        launchOption: {
          index: this.state.values.selectedLaunchOptionIndex,
        },
      })
    });
  }

  paymentMethod() {
    if (this.state.isUsingLaunchToken) {
      return 'token';
    } else if (this.state.values.desiredRuntime) {
      return 'credits:upfront';
    } else {
      return 'credits:ongoing';
    }
  }

  handleSuccessfulLaunch(json) {
    analytics.clusterLaunchAccepted(this.props.clusterSpec);
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  handleFailedLaunch(json) {
    analytics.clusterLaunchRejected(this.props.clusterSpec, json);
    this.setState({ submitting: false });
    this.props.onError({ error: json });
  }

  handleUnexpectedError = (exception) => {
    let message;
    if (exception.message) {
      message = exception.message;
    } else {
      message = exception.toString();
    }
    this.setState({ submitting: false });
    this.props.onError({ error: { unexpected: message } });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.blurEmailField();
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

  handleTokenEntered = () => {
    this.props.dispatch(tokens.actions.loadToken(this.state.values.launchToken))
      .then((response) => {
        if (response.error) {
          return Promise.reject(response);
        }
        this.setState({ token: response.payload.data.data[0] }, () => {
          this.setState({
            errors: validate(this.state.values, this.state, this.props)
          }, () => {
            this.handleShowNextPage();
          });
        });
      })
      .catch((error) => {
        this.props.onError({
          error,
          title: 'Verifying your launch token has failed',
        });
      });
  }

  handleUseLaunchToken = () => {
    this.setState({ isUsingLaunchToken: true });
  }

  blurEmailField() {
    if (this.emailInput) { this.emailInput.blur() ; }
  }

  render() {
    return (
      <ClusterLaunchForm
        {...this.state}
        {...this.props}
        emailRef={(el) => { this.emailInput = el; }}
        // eslint-disable-next-line react/jsx-handler-names
        handleSubmit={this.handleSubmit}
        onChange={this.handleFormChange}
        onQueueChange={this.handleQueueChange}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.handleShowPreviousPage}
        onTokenEntered={this.handleTokenEntered}
        onUseLaunchToken={this.handleUseLaunchToken}
        tokenName={this.state.values.launchToken}
      />
    );
  }
}

const enhance = compose(
  connect(createStructuredSelector({
    collections: collections.selectors.availableCollections,
    authToken: auth.selectors.ssoToken,
    launchUser: launchUsers.selectors.currentUser,
  })),
);

export default enhance(ClusterLaunchFormContainer);
