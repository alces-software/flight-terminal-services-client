import React from 'react';
// import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { withConfirmation } from 'flight-reactware';

import * as actions from '../actions';

const TerminateButton = withConfirmation({
  confirmButtonText: 'Terminate',
  confirmButtonColor: 'danger',
  confirmText: (
    <div>
      <p>
        You are about to terminate your Alces Flight Compute HPC cluster.  By
        clicking the "Terminate" button you understand that this action cannot
        be undone, and will result in the loss of any work you have not saved.
      </p>
      <p>I understand and wish to continue.</p>
    </div>
  ),
  onConfirm: (e, { cluster, dispatch }) => (
    dispatch(actions.terminateCluster(cluster))
  ),
})(({
  cluster,
  confirmationPopover,
  dispatch,
  showingConfirmation,
  submitting,
  ...props,
}) => {
  const submittingText = (
    <span>
      Terminating&hellip;{' '}
      <FontAwesome
        name="spinner"
        spin
      />
    </span>
  );
  return (
    <Button
      {...props}
      color="danger"
    >
      { submitting ? submittingText : 'Terminate' }
      {confirmationPopover}
    </Button>
  );
});

export default connect()(TerminateButton);
