import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { TutorialInfo, TutorialSteps } from 'flight-tutorials-client';

const TutorialLayout = ({
  children,
  completedSteps,
  currentStep,
  expandStep,
  expandedStep,
  onSkipCurrentStep,
  tutorial,
}) => (
  <Container fluid >
    <Row>
      <Col
        lg={{ size: 4, offset: 1 }}
        md={4}
        sm={12}
        xs={12}
      >
        <TutorialInfo tutorial={tutorial} />
        <TutorialSteps
          completedSteps={completedSteps}
          currentStep={currentStep}
          expandStep={expandStep}
          expandedStep={expandedStep}
          onSkipCurrentStep={onSkipCurrentStep}
          steps={tutorial.steps}
        />
      </Col>
      <Col
        lg={7}
        md={8}
        sm={12}
        xs={12}
      >
        {children}
      </Col>
    </Row>
  </Container>
);

TutorialLayout.propTypes = {
  children: PropTypes.node.isRequired,
  completedSteps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.string.isRequired,
  expandStep: PropTypes.func.isRequired,
  expandedStep: PropTypes.string.isRequired,
  onSkipCurrentStep: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired,
};

export default TutorialLayout;
