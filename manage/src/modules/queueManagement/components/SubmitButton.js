/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { StatefulButton } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm, submit as submitReduxForm } from 'redux-form';

import * as selectors from '../selectors';

// XXX take as param?
const formName = 'queueManagement';

const SubmitButton = ({ isCreating, invalid, submit, submitting }) => {
  const icon = <FontAwesome name="cog" />;
  const text = isCreating ? 'Add to cluster' : 'Update';

  return (
    <StatefulButton
      disabled={submitting || invalid}
      onClick={submit}
      submitting={submitting}
      submittingText="Requesting..."
      type="submit"
    >
      {icon} {text}
    </StatefulButton>
  );
};

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
