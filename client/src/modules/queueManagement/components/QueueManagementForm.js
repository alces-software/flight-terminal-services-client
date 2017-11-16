/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { Field, reduxForm, propTypes as formPropTypes } from 'redux-form';
import { FormInput } from 'flight-reactware';
import { compose } from 'recompose';

import { NAME } from '../constants';
import { createOrModifyQueue } from '../actions';

const Input = ({
  autoFocus,
  label,
  name,
  queueName,
  value,
}) => {
  // const qualifiedName = `${queueName}-${name}`;
  const qualifiedName = name;

  return (
    <Field
      autoFocus={autoFocus}
      component={FormInput}
      id={qualifiedName}
      label={label}
      name={qualifiedName}
      type="number"
    />
  );
};
Input.propTypes = {
  autoFocus: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  queueName: PropTypes.string.isRequired,
  value: PropTypes.number,
};

const QueueManagementForm = ({ queueDescriptor, handleSubmit }) => (
  <Form
    onSubmit={handleSubmit}
  >
    <Input
      component={Input}
      label="Desired number of nodes"
      name="desired"
      queueName={queueDescriptor.name}
    />
    <Input
      autoFocus
      component={Input}
      label="Minimum number of nodes"
      name="min"
      queueName={queueDescriptor.name}
    />
    <Input
      component={Input}
      label="Maximum number of nodes"
      name="max"
      queueName={queueDescriptor.name}
    />
  </Form>
);

QueueManagementForm.propTypes = {
  ...formPropTypes,
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      // clusterName: PropTypes.string.isRequired,
      // queueManagement: PropTypes.shape({
      // }).isRequired,
    }),
  }),
  queueDescriptor: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};


const enhance = compose(
  reduxForm({
    destroyOnUnmount: false,
    form: NAME,
    onSubmit: (formValues, dispatch, props) => {
      const cluster = props.cluster;
      dispatch(createOrModifyQueue(cluster, formValues));
    }
  })
);

export default enhance(QueueManagementForm);
