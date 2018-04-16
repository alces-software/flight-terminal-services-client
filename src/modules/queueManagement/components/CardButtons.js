import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button, ButtonToolbar } from 'reactstrap';
import { Styles } from 'flight-reactware';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import RemoveQueueButton from './RemoveQueueButton';
import { showQueueManagementForm } from '../actions';

const CardButtons = ({ className, dispatch, queue, status }) => {
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
            id={`remove-queue-button-${queue.spec.spec}`}
            queue={queue}
          />
        </div>
      );
      break;

    default:
      buttons = null;
  }

  return (
    <ButtonToolbar className={`justify-content-center ${className}`}>
      {buttons}
    </ButtonToolbar>
  );
};

CardButtons.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  queue: PropTypes.shape({
    spec: PropTypes.shape({
      spec: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
    'DELETE_IN_PROGRESS',
  ]).isRequired,
};

const enhance = compose(
  Styles.withStyles`
    margin-top: 1em;
  `,

  connect(),
);

export default enhance(CardButtons);
