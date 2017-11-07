import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import {
  PageHeadingContainer,
  Section,
  SectionButtons,
  SectionIcon,
  makeSection,
} from 'flight-reactware';

import branding from '../modules/branding';
import ContextLink from '../elements/ContextLink';
import CommunitySiteLink from '../elements/CommunitySiteLink';
import DocsSiteLink from '../elements/DocsSiteLink';

const sections = {
  whatIsIt: makeSection('What is Flight Launch?', 'what-is-it', 'pink', 'question'),
  howToUse: makeSection('How to use Flight Launch', 'how-to-use', 'orange', 'ticket'),
  readyToLaunch: makeSection('Ready to launch', 'read-to-launch', 'blue', 'plane'),
};

const Home = () => {
  return (
    <div>
      <Container fluid>
        <PageHeadingContainer>
          <div className="d-flex justify-content-center">
            <div>
              <div className="d-flex justify-content-center">
                <h1>
                  Welcome to the Alces Flight Launch Service!
                </h1>
              </div>
              <div className="d-flex justify-content-center">
                <branding.WithBranding>
                  {(branding) => <h3>{branding.navEntry}</h3>}
                </branding.WithBranding>
              </div>
              <p>
                This service has been developed to quickly launch a preconfigured
                High Performance Computing (HPC) cluster.
              </p>
            </div>
            <branding.Logo height="100px" />
          </div>
          <SectionButtons sections={Object.values(sections)} />
        </PageHeadingContainer>
      </Container>
      <Container>
        <Section
          overview="The Alces Flight Launch service rapidly delivers a whole
          HPC cluster, ready to go, complete with job scheduler and
          applications."
          section={sections.whatIsIt}
          title="What is the Alces Flight Launch service?"
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
          title="How to use the Alces Flight Launch service"
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
                <a
                  href="mailto:flight@alces-flight.com?subject=Flight Launch
                  Token Request&body=Please send me a Flight Launch Token by
                  return email.%0D%0A%0D%0AKind regards."
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Let us know
                </a> and we’ll start the process of securing you a Flight
                Launch token.
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
        </Section>
        <Section
          overview="Want to spend some time reading up on the Alces Flight
          Launch service prior to starting your evaluation?"
          section={sections.readyToLaunch}
          title="Getting ready to launch and more information"
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

export default Home;
