import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
import styled from 'styled-components';
import {
  LinkContainer,
  Section,
  SectionIcon,
  makeSection,
} from 'flight-reactware';
import FontAwesome from 'react-fontawesome';

import ContextLink from '../elements/ContextLink';
import CommunitySiteLink from '../elements/CommunitySiteLink';
import DocsSiteLink from '../elements/DocsSiteLink';
import PageHeading from '../components/PageHeading';
import tenants from '../modules/tenants';

const sections = {
  whatIsIt: makeSection('What is Flight Launch?', 'what-is-it', 'pink', 'question'),
  howToUse: makeSection('How to use Flight Launch', 'how-to-use', 'orange', 'ticket'),
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

const Home = ({ tenantIdentifier }) => {
  return (
    <div>
      <Container fluid>
        <PageHeading
          overview="This service has been developed to quickly launch a
          preconfigured High Performance Computing (HPC) cluster."
          sections={Object.values(sections)}
          title="Welcome to Alces Flight Launch!"
        />
      </Container>
      <Container>
        <Section
          overview="The Alces Flight Launch service rapidly delivers a whole
          HPC cluster, ready to go, complete with job scheduler and
          applications."
          section={sections.whatIsIt}
          title="What is Alces Flight Launch?"
        >
          <p>
            Simply select the HPC cluster you want to evaluate, enter your
            Flight Launch token, cluster name, and an email address for
            notifications and you are ready to go!
          </p>
          <p>
            Clusters are deployed in a Virtual Private Cluster (VPC)
            environment for security, with SSH and graphical-desktop
            connectivity for users.  Data management tools for POSIX and S3
            object storage are also included to help users transfer files
            and manage storage resources.
          </p>
        </Section>
        <Section
          overview="Use a Flight Launch token to take an Alces Flight Compute cluster for a spin — no cloud account required!"
          section={sections.howToUse}
          title="How to use Alces Flight Launch."
        >
          <Row>
            <Col>
              <SectionIcon name="ticket" />
              <h4>
                How to use a Flight Launch Token
              </h4>
              <p>
                Through one of the Alces Flight Crew or via our trusted partner
                network you should have a received a Flight Launch token
                consisting of three unrelated words (e.g. “flower – star –
                moose”). Don’t have one yet?{' '}
                <ContextLink
                  linkSite="Home"
                  location="/start#launch-flight"
                >
                  Let us know
                </ContextLink> and we’ll start the process of securing you a
                Flight Launch token.
              </p>
              <p>
                Once you’ve secured a token simply search through the available
                preconfigured clusters. When you’ve decided the HPC cluster you
                wish to trial enter the token, the name you’d like to give your
                cluster, and the email address you want to receive status
                updates to.
              </p>
              <p>
                Then, simply press launch! You are now moments away from HPC
                cluster access.
              </p>
            </Col>
            <Col>
              <SectionIcon name="server" />
              <h4>
                Using your preconfigured HPC cluster
              </h4>
              <p>
                Once you are notified that your HPC cluster is active you can
                use the pre-determined time as you see fit. Work with the
                applications that come pre-installed or try your hand at
                installing and running applications from the{' '}
                <ContextLink
                  linkSite="Gridware"
                  location="/"
                >
                  Alces Gridware open source application library
                </ContextLink>.
              </p>
              <p>
                While we’ll send you emails to let you know when your HPC
                cluster has been launched, remember this is a trial service and
                is time limited. Please remember to save any work you perform
                while using your Flight Launch cluster!
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <CallToAction
                icon="play-circle"
                to={`/${tenantIdentifier}/launch`}
              >
                Launch a cluster now
              </CallToAction>
            </Col>
          </Row>
        </Section>
        <Section
          overview="Want to spend some time reading up on Alces Flight Compute
          prior to starting your evaluation?"
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
  tenantIdentifier: PropTypes.string.isRequired,
};

const enhance = connect(createStructuredSelector({
  tenantIdentifier: tenants.selectors.identifier,
}));

export default enhance(Home);
