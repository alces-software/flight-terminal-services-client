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
  onUseLaunchToken: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecrectAccessKey: PropTypes.string,
  }),
  values: PropTypes.shape({
    awsAccessKeyId: PropTypes.string,
    awsSecrectAccessKey: PropTypes.string,
  }),
};

const Credentials = ({
  errors,
  id,
  onChange,
  onUseLaunchToken,
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
        placeholder="Enter your Flight Launch token"
        value={values.launchToken}
      />
      <p>
        Let me <a onClick={onUseLaunchToken}>use my AWS credentials</a>.
      </p>
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
          placeholder="Enter your AWS Access Key ID"
          value={values.awsAccessKeyId}
        />
        <Input
          error={errors.awsSecrectAccessKey}
          id={`${id}-secret-key`}
          name="awsSecrectAccessKey"
          onChange={onChange}
          placeholder="Enter your AWS Secret Access Key"
          value={values.awsSecrectAccessKey}
        />
        <p>
          I have a <a onClick={onUseLaunchToken}>Flight Launch token</a>.
        </p>
      </div>
    );
  }
};

Credentials.propTypes = propTypes;

export default Credentials;
