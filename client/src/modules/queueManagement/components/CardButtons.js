import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'reactstrap';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { removeQueue, showQueueManagementForm } from '../actions';

const CardButtons = ({ dispatch, qspec, status }) => {
  let buttons;
  switch (status) {
    case 'UNCONFIGURED':
      buttons = (
        <Button
          color="primary"
          onClick={() => dispatch(showQueueManagementForm(qspec.spec, 'CREATE'))}
        >
          <FontAwesome name="plus" /> Add to cluster
        </Button>
      );
      break;

    case 'CREATE_IN_PROGRESS':
    case 'MODIFY_IN_PROGRESS':
    case 'CREATE_COMPLETE':
    default:
      buttons = (
        <div>
          <Button
            className="mr-1"
            color="primary"
            onClick={() => dispatch(showQueueManagementForm(qspec.spec, 'MODIFY'))}
          >
            <FontAwesome name="cog" /> Modify
          </Button>
          <Button
            color="primary"
            onClick={() => dispatch(removeQueue(qspec.spec))}
          >
            <FontAwesome name="trash" /> Remove
          </Button>
        </div>
      );
  }

  return (
    <ButtonToolbar className="justify-content-center">
      {buttons}
    </ButtonToolbar>
  );
};

CardButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  qspec: PropTypes.shape({
    spec: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
  ]).isRequired,
};

export default connect()(CardButtons);
