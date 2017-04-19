/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

import Input from './ClusterFormInput';

const propTypes = {
  id: PropTypes.string.isRequired,
  onToggleUseLaunchToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecrectAccessKey: PropTypes.string,
  }),
  showAwsCredentialsLink: PropTypes.bool.isRequired,
  useLaunchToken: PropTypes.bool.isRequired,
  values: PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecrectAccessKey: PropTypes.string,
  }),
};

const defaultProps = {
  showAwsCredentialsLink: false,
};

const Credentials = ({
  errors,
  id,
  onChange,
  onToggleUseLaunchToken,
  showAwsCredentialsLink,
  values,
  useLaunchToken,
}) => {
  if (useLaunchToken) {
    return (<div>
      <Input
        error={errors.launchToken}
        id={`${id}-launch-token`}
        name="launchToken"
        onChange={onChange}
        label="Enter your Flight Launch token"
        value={values.launchToken}
        help="A Flight Launch token allows you to try out Alces Flight Compute
        without incurring any charges."
      />
      {
        showAwsCredentialsLink ?
          <p>
            Let me <a onClick={onToggleUseLaunchToken}>use my AWS credentials</a>.
          </p> :
          null
      }
    </div>
    );
  } else {
    return (
      <div>
        <Input
          error={errors.awsAccessKeyId}
          id={`${id}-access-key`}
          name="awsAccessKeyId"
          onChange={onChange}
          label="Enter your AWS Access Key ID"
          value={values.awsAccessKeyId}
        />
        <Input
          error={errors.awsSecrectAccessKey}
          id={`${id}-secret-key`}
          name="awsSecrectAccessKey"
          onChange={onChange}
          label="Enter your AWS Secret Access Key"
          value={values.awsSecrectAccessKey}
        />
        <p>
          I have a <a onClick={onToggleUseLaunchToken}>Flight Launch token</a>.
        </p>
      </div>
    );
  }
};

Credentials.propTypes = propTypes;
Credentials.defaultProps = defaultProps;

export default Credentials;
