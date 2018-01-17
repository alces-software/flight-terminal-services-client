import React from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withConfirmation } from 'flight-reactware';
import { connect } from 'react-redux';

import * as actions from '../actions';

const TerminateButton = withConfirmation({
  confirmButtonText: 'Terminate',
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
  return (
    <Button
      {...props}
      color="success"
    >
      Terminate
      {confirmationPopover}
    </Button>
  );
});

export default connect()(TerminateButton);
