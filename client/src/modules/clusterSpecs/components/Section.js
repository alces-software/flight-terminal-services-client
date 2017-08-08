import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import branding from '../../../modules/branding';

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Section = ({ children }) => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <div className="d-flex justify-content-center">
              <h1>
                Launch Alces Flight
                <small><branding.Header /></small>
              </h1>
            </div>
            <div className="d-flex justify-content-center">
              <branding.Logo />
            </div>
            <div className="d-flex justify-content-center">
              <p>
                Ready to get going? Choose a cluster specification and launch
                your cluster now!
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Container fluid>
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
