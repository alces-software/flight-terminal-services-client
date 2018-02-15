import React from 'react';
import PropTypes from 'prop-types';
import { CardText } from 'reactstrap';

function mkPluralization(singular, plural) {
  return function(number) {
    return number === 1 ? singular : plural;
  };
}
const unitOrUnits = mkPluralization('unit', 'units');
const nodeOrNodes = mkPluralization('node', 'nodes');

const CardStatusText = ({
  consumesCredits,
  cuPerNode,
  current,
  modification,
  status,
}) => {
  switch (status) {
    case 'CREATE_IN_PROGRESS':
      return (
        <div>
          <CardText>
            This queue is currently being configured by your cluster.  When
            available, it will run {modification.desired}
            {' '}{nodeOrNodes(modification.desired)}, with a
            minimum of {' '}{modification.min} and a maximum of
            {' '}{modification.max}.
          </CardText>
          {
            consumesCredits
              ? (
                <CardText>
                  When complete, this queue will consume {cuPerNode}{' '}
                  compute {unitOrUnits(cuPerNode)} per-node per-hour, for a
                  total consumption of
                  {' '}{modification.desired * cuPerNode} compute
                  {' '}{unitOrUnits(cuPerNode)} per-hour.
                </CardText>
              )
              : null
          }
        </div>
      );

    case 'MODIFY_IN_PROGRESS':
      return (
        <div>
          <CardText>
            This queue is available to your cluster and is currently being
            reconfigured.  When complete, it will run
            {' '}{modification.desired} {nodeOrNodes(modification.desired)}{' '}
            with a minimum of
            {' '}{modification.min} and a maximum of
            {' '}{modification.max}.
          </CardText>
          {
            consumesCredits
              ? (
                <CardText>
                  This queue consumes {cuPerNode} compute
                  {' '}{unitOrUnits(cuPerNode)} per-node per-hour, for a total
                  consumption of
                  {' '}{modification.desired * cuPerNode}{' '} compute
                  {' '}{unitOrUnits(modification.desired * cuPerNode)}{' '}
                  per hour.
                </CardText>
              )
              : null
          }
        </div>
      );

    case 'CREATE_COMPLETE':
      return (
        <div>
          <CardText>
            This queue is available to your cluster.  It is running
            {' '}{current.current} {nodeOrNodes(current.current)} with a
            minimum of {current.min} and a maximum of {current.max}.
          </CardText>
          {
            consumesCredits
              ? (
                <CardText>
                  This queue consumes {cuPerNode} compute
                  {' '}{unitOrUnits(cuPerNode)} per-node per-hour, for a total
                  consumption of
                  {' '}{current.current * cuPerNode}{' '}
                  compute {unitOrUnits(current.current * cuPerNode)} per hour.
                </CardText>
              )
              : null
          }
        </div>
      );

    case 'UNCONFIGURED':
      return (
        <div>
          <CardText>
            This queue has not been added to your cluster.  To add it to your
            cluster, click on "Add to cluster" below.
          </CardText>
          {
            consumesCredits
              ? (
                <CardText>
                  If added to your cluster, this queue will consume
                  {' '}{cuPerNode}{' '} compute {unitOrUnits(cuPerNode)}{' '}
                  per-node per-hour.  Currently it consumes 0 compute units.
                </CardText>
              )
              : null
          }
        </div>
      );

    case 'DELETE_IN_PROGRESS':
      return (
        <div>
          <CardText>
            This queue is being removed from your cluster.
          </CardText>
          {
            consumesCredits
              ? (
                <CardText>
                  Once removed it will no longer consume any compute units.
                </CardText>
              )
              : null
          }
        </div>
      );

    default:
      return <div><CardText>Unknown status</CardText></div>;
  }
};

CardStatusText.propTypes = {
  consumesCredits: PropTypes.bool.isRequired,
  cuPerNode: PropTypes.number.isRequired,
  current: PropTypes.shape({
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  }),
  modification: PropTypes.shape({
    desired: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
  }),
  status: PropTypes.oneOf([
    'UNCONFIGURED',
    'CREATE_IN_PROGRESS',
    'CREATE_COMPLETE',
    'MODIFY_IN_PROGRESS',
    'DELETE_IN_PROGRESS',
  ]).isRequired,
};

export default CardStatusText;
