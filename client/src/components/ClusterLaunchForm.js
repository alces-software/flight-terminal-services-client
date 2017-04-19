/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon } from 'flight-common';

import { clusterSpecShape } from '../utils/propTypes';
import Credentials from './ClusterLaunchCredentials';
import ClusterName from './ClusterLaunchClusterName';
import Email from './ClusterLaunchEmail';
import MultiPageForm from './MultiPageForm';

class ClusterLaunchForm extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    currentPageIndex: PropTypes.number.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onShowNextPage: PropTypes.func.isRequired,
    onShowPreviousPage: PropTypes.func.isRequired,
    onToggleUseLaunchToken: PropTypes.func.isRequired,
    showAwsCredentialsLink: PropTypes.bool,
    submitting: PropTypes.bool,
    useLaunchToken: PropTypes.bool.isRequired,
  };

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
            launchToken: this.props.values.launchToken,
          }}
          onChange={this.props.onChange}
          onToggleUseLaunchToken={this.props.onToggleUseLaunchToken}
          showAwsCredentialsLink={this.props.showAwsCredentialsLink}
          useLaunchToken={this.props.useLaunchToken}
        />),
      valid: () => {
        if (this.props.useLaunchToken) {
          return !this.props.errors.launchToken;
        } else {
          return !this.props.errors.awsAccessKeyId && !this.props.errors.awsSecrectAccessKey;
        }
      },
    },
    {
      render: () => (
        <ClusterName
          id={this.props.clusterSpec.ui.title}
          error={this.props.errors.clusterName}
          value={this.props.values.clusterName}
          onChange={this.props.onChange}
          placeholder={this.props.values.launchToken}
          useLaunchToken={this.props.useLaunchToken}
        />),
      valid: () => !this.props.errors.clusterName,
    },
    {
      render: () => (
        <Email
          ref={(el) => { this.emailPage = el; }}
          id={this.props.clusterSpec.ui.title} 
          error={this.props.errors.email}
          value={this.props.values.email}
          onChange={this.props.onChange}
        />),
      valid: () => !this.props.errors.email,
    },
  ];

  blurEmailField() {
    this.emailPage && this.emailPage.blur();
  }

  render() {
    return (
      <MultiPageForm
        className="ClusterLaunchForm"
        currentPageIndex={this.props.currentPageIndex}
        handleSubmit={this.props.handleSubmit}
        onCancel={this.props.onCancel}
        onShowNextPage={this.props.onShowNextPage}
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
        confirmText={
          this.props.useLaunchToken ?
            (<div>
              <p>
             You are about to launch an Alces Flight Compute HPC cluster for trial use through the
             Alces Flight Launch service.  By clicking the launch button you
             understand this is a trial service and that Alces Flight Ltd
             takes no responsibility for the work performed during the trial.
             Users are highly encouraged to save their work as once the trial
             ends they will no longer have access to their work.
              </p>
              <p>I understand and wish to continue.</p>
            </div>) :
            (<div>
              <p>You are about to launch an Alces Flight Compute HPC cluster using your AWS account.
                By clicking the Launch button you understand that your AWS
                account will incur charges.  You further understand that you
                have the responsibility to shut down the cluster, and that
                you will continue to incur charges until the cluster is
                shut down.</p>
              <p>I understand and wish to continue.</p>
            </div>)
        }
      />
    );
  }
}

export default ClusterLaunchForm;
