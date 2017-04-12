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
            (<span>
              Launching this cluster will consume your Flight Launch token.
              You will not be charged for running this cluster, but <em>Alces
                Flight</em> reserve the right to terminate it without notice.
            </span>) :
            (<span>
              Launching this cluster will incur charges against your AWS account
              until the cluster is shutdown.  Flight Launch will not shut the
              cluster down, it is your responsibility to do so when you have
              finished using it.
            </span>)
        }
      />
    );
  }
}

export default ClusterLaunchForm;
