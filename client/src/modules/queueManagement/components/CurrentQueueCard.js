import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  Card,
  CardBlock,
  CardText,
  CardTitle,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import { removeQueue, showQueueManagementForm } from '../actions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  queue: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    spec: PropTypes.shape({
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spec: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const StatusText = ({ queue, status }) => {
  switch (status) {
    case 'CREATE_IN_PROGRESS':
      return (
        <p>
          This queue is currently being configured by your cluster.  When
          available, it will run {queue.current} nodes, with a minimum of
          {' '}{queue.min} and a maximum of {queue.max}.
        </p>
      );

    case 'MODIFY_IN_PROGRESS':
      return (
        <p>
          This queue is available to your cluster and is currently being
          reconfigured.  When complete, it will run
          {' '}{queue.modification.current} nodes with a minimum of
          {' '}{queue.modification.min} and a maximum of
          {' '}{queue.modification.max}.
        </p>
      );

    case 'COMPLETE':
      return (
        <p>
          This queue is available to your cluster.  It is running
          {' '}{queue.current} nodes with a minimum of {queue.min} and a
          maximum of {' '}{queue.max}.
        </p>
      );

    default:
      return <p>Unknown status</p>;
  }
};

const CardIcons = ({ status }) => {
  switch (status) {
    case 'CREATE_IN_PROGRESS':
      return (
        <FontAwesome
          className="float-right"
          name="cog"
          spin
        />
      );

    case 'MODIFY_IN_PROGRESS':
      return (
        <FontAwesome
          className="float-right"
          name="cog"
          spin
        />
      );

    case 'COMPLETE':
      return (
        <FontAwesome
          className="float-right"
          name="check-square-o"
        />
      );

    default:
      return null;
  }
};

const CurrentQueueCard = ({ dispatch, queue }) => {

  return (
    <Card>
      <CardBlock>
        <CardIcons status={queue.status} />
        <CardTitle>
          {queue.spec.name}
        </CardTitle>
        <CardText>
          {queue.spec.description}
        </CardText>
        <CardText>
          <StatusText
            queue={queue}
            status={queue.status}
          />
        </CardText>
        <CardText>
          {queue.status}
        </CardText>
        <ButtonToolbar className="justify-content-center">
          <Button
            className="mr-1"
            color="primary"
            onClick={() => dispatch(showQueueManagementForm(queue.spec, 'MODIFY'))}
          >
            <FontAwesome name="cog" /> Modify
          </Button>
          <Button
            color="primary"
            onClick={() => dispatch(removeQueue(queue.spec))}
          >
            <FontAwesome name="trash" /> Remove
          </Button>
        </ButtonToolbar>
      </CardBlock>
    </Card>
  );
};

CurrentQueueCard.propTypes = propTypes;

export default connect()(CurrentQueueCard);

