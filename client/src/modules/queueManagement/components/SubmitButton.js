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
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as selectors from '../selectors';

// XXX take as param?
const formName = 'queueManagement';
const StatefulButton = Button;

const SubmitButton = ({ isCreating, invalid, submit, submitting }) => (
  <StatefulButton
    disabled={submitting || invalid}
    icon="cog"
    onClick={submit}
    submitting={submitting}
    type="submit"
  >
    { isCreating ? 'Add to cluster' : 'Update' }
  </StatefulButton>
);

SubmitButton.propTypes = {
  invalid: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const enhance = compose(
  connect(
    createStructuredSelector({
      isCreating: selectors.isCreatingQueue,
    }),
    {
      submit: () => submitReduxForm(formName),
    }
  ),

  reduxForm({
    form: formName,
  }),
);

export default enhance(SubmitButton);
