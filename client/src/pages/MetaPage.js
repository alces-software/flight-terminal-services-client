import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

const MetaPage = (Content, passThroughProps = {}) => {
  return () => {
    const { title, overview } = Content;
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <h1>{title}</h1>
              <h2>{overview}</h2>
              <Content {...passThroughProps} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  };
};

export default MetaPage;
