import React from 'react';
// import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
import styled from 'styled-components';
import {
  LinkContainer,
  PageHeading,
  Section,
  SectionIcon,
  makeSection,
} from 'flight-reactware';
import FontAwesome from 'react-fontawesome';

import CommunitySiteLink from '../elements/CommunitySiteLink';
import ContextLink from '../elements/ContextLink';
import DocsSiteLink from '../elements/DocsSiteLink';

const sections = {
  whatIsIt: makeSection('What is Flight Terminal Services?', 'what-is-it', 'pink', 'question'),
  moreInfo: makeSection('Getting more information', 'more-information', 'blue', 'book'),
};

const CallToAction = styled(({ children, className, icon, to }) => {
  return (
    <LinkContainer 
      className={className}
      to={to}
    >
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
    </LinkContainer>
  );
})`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: "Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const Home = () => {
  return (
    <div>
      <Container fluid>
        <PageHeading
          overview="This service has been developed to help manage your Flight
          High Performance Computing (HPC) cluster."
          sections={Object.values(sections)}
          title="Welcome to Alces Flight Terminal Services!"
        />
      </Container>
      <Container>
        <Section
          overview="The Alces Flight Terminal service provides access to a
          number of tools to ease the management of your Flight HPC cluster."
          section={sections.whatIsIt}
          title="What is Alces Flight Terminal Services?"
        >
          <Row>
            <Col>
              <SectionIcon name="user" />
              <h4>
                Manage your site's users and groups
              </h4>
              <p>
                Simply use {' '}
                <ContextLink
                  linkSite="Directory"
                  location="/directory"
                >
                  the embeded terminal
                </ContextLink>{' '}
                to manage your HPC cluster's users and groups.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <CallToAction
                icon="play-circle"
                to="/directory"
              >
                Manage your user and group directory now
              </CallToAction>
            </Col>
          </Row>
        </Section>
        <Section
          overview="Want to spend some time reading up on Alces Flight
          Terminal Services first?"
          section={sections.moreInfo}
          title="Getting more information."
        >
          <p>
            We have a{' '}
            <DocsSiteLink>documentation site</DocsSiteLink> dedicated to the
            cause as well as a {' '}
            <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
            {' '} available for you to join in and read through.
          </p>
          <p>
            Enjoy your flight!
          </p>
        </Section>
      </Container>
    </div>
  );
};

Home.propTypes = {
};

export default Home;
