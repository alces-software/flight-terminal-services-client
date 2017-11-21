import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBlock,
  CardText,
  CardTitle,
} from 'reactstrap';

import StatusText from './CardStatusText';
import StatusIcon from './CardStatusIcon';
import Buttons from './CardButtons';

const propTypes = {
  queue: PropTypes.shape({
    status: PropTypes.string.isRequired,
    spec: PropTypes.shape({
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const CurrentQueueCard = ({ queue }) => (
  <Card>
    <CardBlock>
      <StatusIcon status={queue.status} />
      <CardTitle>
        {queue.spec.name}
      </CardTitle>
      <CardText>
        {queue.spec.description}
      </CardText>
      <CardText>
        <StatusText
          current={queue.current}
          modification={queue.modification}
          status={queue.status}
        />
      </CardText>
      <Buttons
        qspec={queue.spec}
        status={queue.status}
      />
    </CardBlock>
  </Card>
);

CurrentQueueCard.propTypes = propTypes;

export default CurrentQueueCard;
