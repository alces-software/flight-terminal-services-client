import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'reactstrap';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { withConfirmation } from 'flight-reactware';

import { removeQueue, showQueueManagementForm } from '../actions';

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
})(({
  children,
  confirmationPopover,
  showingConfirmation,
  submitting,
  ...props,
}) => {
  return (
    <Button {...props} >
      {children}
      {confirmationPopover}
    </Button>
  );
});

const CardButtons = ({ dispatch, queue, status }) => {
  let buttons;
  switch (status) {
    case 'UNCONFIGURED':
      buttons = (
        <Button
          color="primary"
          onClick={() => dispatch(showQueueManagementForm(queue, 'CREATE'))}
        >
          <FontAwesome name="plus" /> Add to cluster
        </Button>
      );
      break;

    case 'CREATE_IN_PROGRESS':
    case 'MODIFY_IN_PROGRESS':
    case 'CREATE_COMPLETE':
      buttons = (
        <div>
          <Button
            className="mr-1"
            color="primary"
            onClick={() => dispatch(showQueueManagementForm(queue, 'MODIFY'))}
          >
            <FontAwesome name="cog" /> Modify
          </Button>
          <RemoveQueueButton
            color="primary"
            id="remove-queue-button"
            onConfirm={() => dispatch(removeQueue(queue))}
          >
            <FontAwesome name="trash" /> Remove
          </RemoveQueueButton>
        </div>
      );

    default:
      buttons = null;
  }

  return (
    <ButtonToolbar className="justify-content-center">
      {buttons}
    </ButtonToolbar>
  );
};

CardButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  queue: PropTypes.object.isRequired,
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
    'DELETE_IN_PROGRESS',
  ]).isRequired,
};

export default connect()(CardButtons);
