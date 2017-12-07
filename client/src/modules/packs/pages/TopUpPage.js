/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Section, SectionIcon, makeSection } from 'flight-reactware';

import CommunitySiteLink from '../../../elements/CommunitySiteLink';
import ContextLink from '../../../elements/ContextLink';
import DocsSiteLink from '../../../elements/DocsSiteLink';
import launchUsers from '../../../modules/launchUsers';

import TopUpForm from '../components/TopUpForm';
import Modal from '../components/Modal';

const sections = {
  topUp: makeSection('Compute packs', 'topup', 'pink', 'cog'),
};

const TopUpPage = () => {
  return (
    <Container >
      <Modal />
      <Section
        overview="Top up your account with a compute pack to gain access to
        new compute time."
        section={sections.topUp}
        title="Top up your account."
      >
        <Row>
          <Col>
            <SectionIcon name="plane" />
            <h4>
              How does this work?
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
              Once you’ve secured a token simply enter it into the form
              opposite and click "Top up".  The token's credits will be
              allocated to your account and you can use them to launch an HPC
              cluster.
            </p>
            <p>
              More information about compute packs can be found on our{' '}
              <DocsSiteLink>documentation site</DocsSiteLink>.  We also have a
              {' '}
              <CommunitySiteLink>Community Support Portal</CommunitySiteLink>
              {' '} available for you to join in and read through.
            </p>
          </Col>
          <Col>
            <SectionIcon name="ticket" />
            <h4>
              Top up your account from a Flight Launch token.
            </h4>
            <p>
              Enter your Flight Launch token in the form below, and click "Top
              up".  The token's credits will be allocated to your Flight
              account.
            </p>
            <TopUpForm />
          </Col>
        </Row>
      </Section>
    </Container>
  );
};

TopUpPage.propTypes = {
};

const enhance = compose(
  connect(createStructuredSelector({
    launchUser: launchUsers.selectors.currentUser,
  })),

  branch(
    ({ launchUser }) => !launchUser,
    renderComponent(() => <Redirect to={`/`} />),
  ),
);

export default enhance(TopUpPage);
