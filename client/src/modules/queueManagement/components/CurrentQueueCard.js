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

import { showQueueManagementForm } from '../actions';

const propTypes = {
  // config: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
  // }).isRequired,
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
          onClick={() => dispatch(removeQueue(cluster, queue.spec))}
        >
          <FontAwesome name="trash" /> Remove
        </Button>
      </ButtonToolbar>
    </CardBlock>
  </Card>
);

CurrentQueueCard.propTypes = propTypes;

export default connect()(CurrentQueueCard);

