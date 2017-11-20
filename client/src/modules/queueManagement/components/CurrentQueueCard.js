import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  Card,
  CardBlock,
  CardHeader,
  CardText,
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
    spec: PropTypes.string.isRequired,
  }).isRequired,
};


const CurrentQueueCard = ({ dispatch, queue }) => (
  <Card>
    <CardHeader>
      {queue.spec}
    </CardHeader>
    <CardBlock>
      <CardText>
        Running {queue.current} nodes (min {queue.min}, max {queue.max})
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

CurrentQueueCard.propTypes = propTypes;

export default connect()(CurrentQueueCard);

