import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
} from 'reactstrap';
import styled, { css } from 'styled-components';

import StatusText from './CardStatusText';
import StatusIcon from './CardStatusIcon';
import Buttons from './CardButtons';

const QueueCard = styled(({ className, usingOngoingCredits, queue }) => (
  <Card className={className}>
    <CardBody>
      <StatusIcon status={queue.status} />
      <CardTitle>
        {queue.spec.name}
      </CardTitle>
      <CardText>
        {queue.spec.description}
      </CardText>
      <StatusText
        cuPerNode={queue.spec.cuPerNode}
        current={queue.current}
        modification={queue.modification}
        status={queue.status}
        usingOngoingCredits={usingOngoingCredits}
      />
      <Buttons
        queue={queue}
        status={queue.status}
      />
    </CardBody>
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

QueueCard.propTypes = {
  className: PropTypes.string,
  queue: PropTypes.shape({
    status: PropTypes.string.isRequired,
    spec: PropTypes.shape({
      cuPerNode: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  usingOngoingCredits: PropTypes.bool.isRequired,
};

export default QueueCard;
