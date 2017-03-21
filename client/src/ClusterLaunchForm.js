/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Icon } from 'flight-common';

import { clusterSpecShape } from './propTypes';
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
    submitting: PropTypes.bool,
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
          }}
          onChange={this.props.onChange}
        />),
      valid: () => (
        !this.props.errors.awsAccessKeyId && !this.props.errors.awsSecrectAccessKey
      ),
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
      />
    );
  }
}

export default ClusterLaunchForm;
