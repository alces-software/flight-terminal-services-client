/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, submit as submitReduxForm } from 'redux-form';
// import { StatefulButton } from 'flight-reactware';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// import { cluster as formName } from '../../forms/names';

// XXX take as param?
const formName = 'queueManagement';
const StatefulButton = Button;

const SubmitButton = ({ editing, invalid, submit, submitting }) => (
  <StatefulButton
    disabled={submitting || invalid}
    icon="cog"
    onClick={submit}
    submitting={submitting}
    type="submit"
  >
    { editing ? 'Update' : 'Create' }
  </StatefulButton>
);

SubmitButton.propTypes = {
  editing: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const enhance = compose(
  connect(null, {
    submit: () => submitReduxForm(formName),
  }),

  reduxForm({
    destroyOnUnmount: !module.hot,
    form: formName,
  }),
);

export default enhance(SubmitButton);
