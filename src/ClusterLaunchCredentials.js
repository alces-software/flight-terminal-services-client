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

const Credentials = ({ errors, id, onChange, values }) => (
  <div>
    <Input
      error={errors.awsAccessKeyId}
      id={`${id}-access-key`}
      name="awsAccessKeyId"
      placeholder="Enter your AWS Access Key ID"
      value={values.awsAccessKeyId}
      onChange={onChange}
    />
    <Input
      error={errors.awsSecrectAccessKey}
      id={`${id}-secret-key`}
      name="awsSecrectAccessKey"
      placeholder="Enter your AWS Secret Access Key"
      value={values.awsSecrectAccessKey}
      onChange={onChange}
    />
  </div>
);

Credentials.propTypes = propTypes;

export default Credentials;
