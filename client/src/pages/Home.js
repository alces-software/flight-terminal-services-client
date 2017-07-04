import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

import Lorem from 'react-lorem-component';

const Home = () => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <h1>Hello.</h1>
            <h2>This is an example.</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Lorem count="2" />
          </Col>
          <Col>
            <Lorem count="2" />
          </Col>
        </Row>
        <Row>
          <Col>
            <Lorem count="2" />
          </Col>
          <Col>
            <Lorem count="2" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
