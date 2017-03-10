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
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: 'ClusterLaunchForm',
    handleSubmit: (event) => {
      alert('XXX Implement the backend');
      event.preventDefault();
    }
  }

  pages = [
    () => <Credentials id={this.props.clusterSpec.ui.title} />,
    () => <ClusterName id={this.props.clusterSpec.ui.title} />,
    () => <Email id={this.props.clusterSpec.ui.title} />,
  ]

  render() {
    return (
      <MultiPageForm
        className="ClusterLaunchForm"
        handleSubmit={this.props.handleSubmit}
        pages={this.pages}
        submitButtonContent={<span>Launch{' '}<Icon name="plane" /></span>}
      />
    );
  }
}

export default ClusterLaunchForm;
