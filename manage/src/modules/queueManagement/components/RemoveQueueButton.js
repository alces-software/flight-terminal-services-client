import React from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { StatefulButton, withConfirmation } from 'flight-reactware';

import { removeQueue } from '../actions';

const RemoveQueueButton = withConfirmation({
  confirmButtonText: "Remove queue",
  confirmText:(
    <p>
      Are you sure you wish to remove this queue?  All compute nodes
      in the queue will be terminated and any work they are processing
      may be lost.
    </p>
  ),
  placement: "top",
  onConfirm: (event, props) => props.dispatch(removeQueue(props.queue)),
})(({
  confirmationPopover,
  dispatch,
  queue,
  showingConfirmation,
  submitting,
  ...props,
}) => {
  return (
    <StatefulButton
      submitting={submitting}
      submittingText="Requesting..."
      {...props}
    >
      <FontAwesome name="trash" /> Remove
      {confirmationPopover}
    </StatefulButton>
  );
});

export default connect()(RemoveQueueButton);
