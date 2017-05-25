/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import Tip from '../../../components/Tip';

import Input from './ClusterFormInput';

const propTypes = {
  error: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

class ClusterLaunchEmail extends React.Component {
  blur() {
    this.input.blur();
  }

  render() {
    const { error, id, onChange, value } = this.props;

    let tip;
    switch (error) {
      case 'blank':
        tip = <Tip type="error" text="An email address is required." />;
        break;
      case 'invalid':
        tip = <Tip type="error" text="This doesn't look like a valid email address." />;
        break;
      default:
        tip = undefined;
    }

    return (
      <div>
        <Input
          ref={(el) => { this.input = el; }}
          autofocus
          error={error && 'error'}
          help="We need your email address to send you an email when your
          cluster is available."
          id={`${id}-clusterLaunchEmail`}
          name="email"
          onChange={onChange}
          label="Enter your email address"
          value={value}
          tip={tip}
        />
      </div>
    );
  }
}

ClusterLaunchEmail.propTypes = propTypes;

export default ClusterLaunchEmail;
