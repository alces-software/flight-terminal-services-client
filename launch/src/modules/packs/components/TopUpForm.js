/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { Form } from 'reactstrap';
import { Field, reduxForm, propTypes as formPropTypes } from 'redux-form';
import {
  FormInput,
  ReduxFormSubmitButton as SubmitButton,
} from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import tenants from '../../tenants/';

import { NAME } from '../constants';
import { topupFromToken } from '../actions';
import { validator } from '../validations';

const TopUpForm = ({ form, handleSubmit }) => (
  <Form
    onSubmit={handleSubmit}
  >
    <Field
      component={FormInput}
      id="token"
      label="Enter your Flight Launch token"
      name="token"
      type="text"
    />
    <div style={{ textAlign: 'center' }}>
      <SubmitButton
        color="success"
        form={form}
        size="lg"
      >
        Top up
      </SubmitButton>
    </div>
  </Form>
);

TopUpForm.propTypes = {
  ...formPropTypes,
};

const enhance = compose(
  connect(
    createStructuredSelector({
      tenantIdentifier: tenants.selectors.identifier,
    })
  ),

  reduxForm({
    destroyOnUnmount: true,
    form: `${NAME}:topUp`,
    onSubmit: (formValues, dispatch, props) => {
      return dispatch(topupFromToken(props.tenantIdentifier, formValues.token));
    },
    validate: validator,
  })
);

export default enhance(TopUpForm);
