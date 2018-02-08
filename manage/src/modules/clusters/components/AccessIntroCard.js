import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'flight-reactware';

const propTypes = {
  buttonHref: PropTypes.string,
  buttonText: PropTypes.string,
  buttons: PropTypes.node,
  children: PropTypes.node.isRequired,
  headerText: PropTypes.node.isRequired,
  iconName: PropTypes.string.isRequired,
};

const defaultProps = {
  buttonText: 'View details',
};

const AccessIntroCard = ({
  buttonHref,
  buttonText,
  buttons,
  children,
  headerText,
  iconName,
}) => {
  if (buttons == null) {
    buttons = buttonHref == null
      ? null
      : (
        <div className="text-center">
          <LinkContainer to={buttonHref}>
            <Button color="primary" >{buttonText}</Button>
          </LinkContainer>
        </div>
      );
  } else {
    buttons = (
      <div className="text-center">
        {buttons}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        {headerText}
        <span className="pull-right">
          <FontAwesome name={iconName} />
        </span>
      </CardHeader>
      <CardBody>
        <CardText>
          {children}
        </CardText>
        { buttons }
      </CardBody>
    </Card>
  );
};

AccessIntroCard.propTypes = propTypes;
AccessIntroCard.defaultProps = defaultProps;

export default AccessIntroCard;
