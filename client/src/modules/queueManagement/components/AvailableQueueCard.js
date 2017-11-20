import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBlock, CardHeader, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import { showQueueManagementForm } from '../actions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  queue: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};


const AvailableQueueCard = ({ dispatch, queue }) => (
  <Card>
    <CardHeader>
      {queue.name}
    </CardHeader>
    <CardBlock>
      <CardText>
        {queue.description}
      </CardText>
      <div className="text-center">
        <Button
          color="primary"
          onClick={() => dispatch(showQueueManagementForm(queue.name, 'CREATE'))}
        >
          <FontAwesome name="cog" /> Configure
        </Button>
      </div>
    </CardBlock>
  </Card>
);

AvailableQueueCard.propTypes = propTypes;

export default connect()(AvailableQueueCard);
