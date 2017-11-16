import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBlock, CardHeader, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import { showModal } from '../actions';

const propTypes = {
  // config: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
  // }).isRequired,
};


const AvailableQueueCard = ({ dispatch, queue, queueName }) => (
  <Card>
    <CardHeader>
      {/*
      <FontAwesome name={iconName[config.os]} />{' '}
      */}
      {queueName}
    </CardHeader>
    <CardBlock>
      <CardText>
        {queue.description}
      </CardText>
      <div className="text-center">
        <Button
          color="primary"
          // href={config.url}
          onClick={() => dispatch(showModal(queueName, 'CREATE'))}
        >
          <FontAwesome name="cog" /> Configure
        </Button>
      </div>
    </CardBlock>
  </Card>
);

AvailableQueueCard.propTypes = propTypes;

export default connect()(AvailableQueueCard);
