import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Section = ({ children }) => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <h1>Launch Alces Flight</h1>
            <p>
              Ready to get going? Choose a cluster specification and launch
              your cluster now!
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Section.propTypes = propTypes;

export default Section;
