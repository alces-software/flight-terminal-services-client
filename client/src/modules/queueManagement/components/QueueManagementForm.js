/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
}) => {
  return (
    <Field
      autoFocus={autoFocus}
      component={FormInput}
      id={name}
      label={label}
      name={name}
      type="number"
    />
  );
};
Input.propTypes = {
  autoFocus: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const QueueManagementForm = ({ handleSubmit }) => (
  <Form
    onSubmit={handleSubmit}
  >
    <Input
      autoFocus
      component={Input}
      label="Desired number of nodes"
      name="desired"
    />
    <Input
      component={Input}
      label="Minimum number of nodes"
      name="min"
    />
    <Input
      component={Input}
      label="Maximum number of nodes"
      name="max"
    />
  </Form>
);

QueueManagementForm.propTypes = {
  ...formPropTypes,
  cluster: PropTypes.object.isRequired,
  queue: PropTypes.shape({
    current: PropTypes.shape({
      current: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
    }),
    modification: PropTypes.shape({
      desired: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
    }),
  }).isRequired,
};


const enhance = compose(
  connect(
    (state, { queue }) => {
      if (queue.modification) {
        const { desired, min, max } = queue.modification;
        return {
          initialValues: {
            desired,
            max,
            min,
          }
        };
      } else if (queue.current) {
        const { current, min, max } = queue.current;
        return {
          initialValues: {
            desired: current,
            max,
            min,
          },
        };
      } else {
        return {
          initialValues: {
            desired: 0,
            max: 10,
            min: 0,
          },
        };
      }
    },
  ),

  reduxForm({
    destroyOnUnmount: true,
    form: NAME,
    onSubmit: (formValues, dispatch, props) => {
      const cluster = props.cluster;
      return dispatch(createOrModifyQueue(cluster, formValues));
    }
  })
);

export default enhance(QueueManagementForm);
