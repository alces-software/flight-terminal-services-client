import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBlock,
  CardText,
  CardTitle,
} from 'reactstrap';
import styled, { css } from 'styled-components';

import StatusText from './CardStatusText';
import StatusIcon from './CardStatusIcon';
import Buttons from './CardButtons';

const CurrentQueueCard = styled(({ className, queue }) => (
  <Card className={className}>
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
))`
  ${props => {
    let colour = props.queue.status === 'UNCONFIGURED' ? '#f9f9f9' : '#fafff6';
    return css`
      background-color: ${colour};
      background: repeating-linear-gradient(45deg,${colour},${colour} 5px,#ffffff 5px,#ffffff 8px);
    `;
  }}
`;

  // background-color: ${props => props.queue.status === 'UNCONFIGURED' ? 'grey' : 'green'};

CurrentQueueCard.propTypes = {
  className: PropTypes.string.isRequired,
  queue: PropTypes.shape({
    status: PropTypes.string.isRequired,
    spec: PropTypes.shape({
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default CurrentQueueCard;
