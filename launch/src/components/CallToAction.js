import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Button, } from 'reactstrap';
import { LinkContainer, } from 'flight-reactware';

const CallToAction = ({ children, className, icon, to }) => {
  const button = (
    <Button
      color="success"
      size="lg"
    >
      <FontAwesome
        fixedWidth
        name={icon}
      />
      {children}
    </Button>
  );

  if ( to != null) {
    return (
      <LinkContainer 
        className={className}
        to={to}
      >
        {button}
      </LinkContainer>
    );
  }
  return (
    <div className={className}>
      {button}
    </div>
  );
};

CallToAction.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};

export default styled(CallToAction)`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: "Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif;

  A {
    color: inherit;
  }
`;
