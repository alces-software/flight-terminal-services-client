import React from 'react';
import PropTypes from 'prop-types';
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
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CommunitySiteLink from '../elements/CommunitySiteLink';
import ContextLink from '../elements/ContextLink';
import DocsSiteLink from '../elements/DocsSiteLink';
import { clusters } from '../modules';

const sections = {
  whatIsIt: makeSection('What is Flight Manage?', 'what-is-it', 'pink', 'question'),
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

const Home = ({ clusterHostname }) => {
  return (
    <div>
      <Container fluid>
        <PageHeading
          overview="This service has been developed to help access and manage
          a Flight High Performance Computing (HPC) cluster."
          sections={Object.values(sections)}
          title="Welcome to Alces Flight Manage!"
        />
      </Container>
      <Container>
        <Section
          overview="The Alces Flight Manage service provides easy access to
          your Flight HPC clusters and assistance with managing them."
          section={sections.whatIsIt}
          title="What is Alces Flight Manage?"
        >
          <Row>
            <Col>
              <SectionIcon name="plane" />
              <h4>
                Launch a Flight HPC cluster
              </h4>
              <p>
                Simply use {' '}
                <ContextLink
                  linkSite="Launch"
                  location="/"
                >
                  Alces Flight Launch
                </ContextLink>{' '}
                to launch a preconfigured HPC cluster.  Once you are notified
                that your HPC cluster is active follow the provided link to
                gain access to your cluster and assistance with managing it.
              </p>
            </Col>
            <Col>
              <SectionIcon name="terminal" />
              <h4>
                Access your HPC cluster
              </h4>
              <p>
                With Alces Flight Manage you can learn more about your cluster
                with Flight Compute tutorials; gain access using the
                in-browser terminal; or obtain the cluster's SSH and VPN
                access details.
              </p>
            </Col>
            <Col>
              <SectionIcon name="dashboard" />
              <h4>
                Manage your HPC cluster
              </h4>
              <p>
                Alces Flight Manage will assist you in managing your
                long-running HPC clusters.  You can manage your cluster's
                compute queues to ensure maximum efficiency at the lowest
                cost.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <CallToAction
                icon="play-circle"
                to={`/access/${clusterHostname || ''}`}
              >
                Access your clusters now
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
  clusterHostname: PropTypes.string,
};

export default connect(createStructuredSelector({
  clusterHostname: clusters.selectors.hostname,
}))(Home);
