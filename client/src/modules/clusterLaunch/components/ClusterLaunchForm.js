/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon } from 'flight-common';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { clusterSpecShape } from '../../../modules/clusterSpecs/propTypes';
import MultiPageForm from '../../../components/MultiPageForm';
import tokens from '../../../modules/tokens';

import TokenInput from './TokenInput';
import ClusterName from './ClusterLaunchClusterName';
import Email from './ClusterLaunchEmail';
import LaunchOptions from './LaunchOptions';

export class ClusterLaunchForm extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    currentPageIndex: PropTypes.number.isRequired,
    emailRef: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onTokenEntered: PropTypes.func.isRequired,
    onShowNextPage: PropTypes.func.isRequired,
    onShowPreviousPage: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    token: PropTypes.shape({
      attributes: PropTypes.shape({
        assignedTo: PropTypes.string
      }).isRequired,
    }),
    tokenName: PropTypes.string,
    tokenHasLoaded: PropTypes.bool,
  };

  pages = [
    {
      render: () => (
        <TokenInput
          id={this.props.clusterSpec.ui.title}
          error={this.props.errors.launchToken}
          value={this.props.values.launchToken}
          onChange={this.props.onChange}
        />),
      valid: () => !this.props.errors.launchToken,
    },
    {
      render: () => (
        <LaunchOptions
          clusterSpec={this.props.clusterSpec}
          tokenName={this.props.tokenName}
          selectedLaunchOptionIndex={this.props.values.selectedLaunchOptionIndex}
          onChange={this.props.onChange}
        />),
      valid: () => this.props.tokenHasLoaded,
    },
    {
      render: () => (
        <ClusterName
          id={this.props.clusterSpec.ui.title}
          error={this.props.errors.clusterName}
          value={this.props.values.clusterName}
          onChange={this.props.onChange}
          placeholder={this.props.values.launchToken}
        />),
      valid: () => !this.props.errors.clusterName,
    },
    {
      render: () => (
        <Email
          inputRef={this.props.emailRef}
          error={this.props.errors.email}
          id={this.props.clusterSpec.ui.title} 
          onChange={this.props.onChange}
          placeholder={
            this.props.token == null ?
              null :
              this.props.token.attributes.assignedTo
          }
          value={this.props.values.email}
        />),
      valid: () => !this.props.errors.email,
    },
  ];

  handleShowNextPage = () => {
    const indexOfTokenPage = 0;
    if (this.props.currentPageIndex === indexOfTokenPage) {
      this.props.onTokenEntered();
    }
    this.props.onShowNextPage();
  }

  render() {
    return (
      <MultiPageForm
        className="ClusterLaunchForm"
        currentPageIndex={this.props.currentPageIndex}
        handleSubmit={this.props.handleSubmit}
        onCancel={this.props.onCancel}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.props.onShowPreviousPage}
        pages={this.pages}
        submitButtonContent={<span>Launch{' '}<Icon name="plane" /></span>}
        submittingButtonContent={<span>
          Launching&hellip;{' '}
          <Icon name="spinner" spin />
        </span>}
        submitting={this.props.submitting}

        onConfirm={this.props.handleSubmit}
        confirmButtonText="Launch"
        confirmText={<div>
          <p>
            You are about to launch an Alces Flight Compute HPC cluster for trial use through the
            Alces Flight Launch service.  By clicking the launch button you
            understand this is a trial service and that Alces Flight Ltd
            takes no responsibility for the work performed during the trial.
            Users are highly encouraged to save their work as once the trial
            ends they will no longer have access to their work.
          </p>
          <p>I understand and wish to continue.</p>
        </div>}
      />
    );
  }
}

export default connect(createStructuredSelector({
  tokenHasLoaded: tokens.selectors.hasLoaded,
  token: tokens.selectors.tokenFromName,
}))(ClusterLaunchForm);
