import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBlock, CardHeader, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'flight-reactware';

const propTypes = {
  buttonHref: PropTypes.string,
  children: PropTypes.node.isRequired,
  headerText: PropTypes.node.isRequired,
  iconName: PropTypes.string.isRequired,
};

const AccessIntroCard = ({
  buttonHref,
  children,
  headerText,
  iconName,
}) => {
  const buttons = buttonHref == null
    ? null
    : (
      <div className="text-center">
        <LinkContainer to={buttonHref}>
          <Button color="primary" >View details</Button>
        </LinkContainer>
      </div>
    );

  return (
    <Card>
      <CardHeader>
        {headerText}
        <span className="pull-right">
          <FontAwesome name={iconName} />
        </span>
      </CardHeader>
      <CardBlock>
        <CardText>
          {children}
        </CardText>
        { buttons }
      </CardBlock>
    </Card>
  );
};

AccessIntroCard.propTypes = propTypes;

export default AccessIntroCard;
