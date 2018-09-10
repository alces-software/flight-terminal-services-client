import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { Redirect } from 'react-router';
import {
  branch,
  compose,
  lifecycle,
  nest,
  renderComponent,
  withStateHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { auth, showSpinnerUntil } from 'flight-reactware';
import styled from 'styled-components';

import centerUsers from '../../../modules/centerUsers';
import services from '../../../modules/services';

import CenterAccountIsViewerError from '../components/CenterAccountIsViewerError';
import LoadError from '../components/LoadError';
import NoCenterAccountError from '../components/NoCenterAccountError';
import NotLoggedInError from '../components/NotLoggedInError';
import Terminal from '../components/Terminal';
import TokenTooOld from '../components/TokenTooOld';

const NestedLoadError = nest(Container, LoadError);
const NestedNotLoggedInError = nest(Container, NotLoggedInError);
const NestedNoCenterAccount = nest(Container, NoCenterAccountError);
const NestedCenterAccountIsViewerError = nest(Container, CenterAccountIsViewerError);
const NestedTokenTooOld = nest(Container, TokenTooOld);

const PaddedContainer = styled(Container)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

const propTypes = {
  clusterId: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  serviceType: PropTypes.string.isRequired,
  siteId: PropTypes.string,
};

const env = {
  LANG: 'en_GB.UTF-8',
};

const TerminalPage = ({ clusterId, jwt, serviceType, siteId }) => {
  return (
    <PaddedContainer fluid>
      <Terminal
        auth={{
          jwt: jwt,
          serviceType: serviceType,
          siteId: siteId,
          clusterId: clusterId,
        }}
        columns={120}
        rows={25}
        socketIOPath={process.env.REACT_APP_TERMINAL_SERVICE_SOCKET_IO_PATH}
        socketIOUrl={process.env.REACT_APP_TERMINAL_SERVICE_URL}
        termProps={{
          env: env,
        }}
      />
    </PaddedContainer>
  );
};

TerminalPage.propTypes = propTypes;

const enhance = compose(
  connect(createStructuredSelector({
    centerUser: centerUsers.selectors.currentUser,
    centerUserRetrieval: centerUsers.selectors.retrieval,
    clusterId: services.selectors.clusterId,
    cluster: services.selectors.cluster,
    confirmPasswordFormManuallyShown: auth.selectors.confirmPassword.manuallyShown,
    confirmingPassword: auth.selectors.confirmingPassword,
    jwt: auth.selectors.ssoToken,
    serviceType: services.selectors.serviceType,
    servicesRetrieval: services.selectors.retrieval,
    siteId: services.selectors.siteId,
    site: services.selectors.site,
    ssoTokenMatured: auth.selectors.ssoTokenMatured,
    ssoUser: auth.selectors.currentUserSelector,
  })),

  // We're able to have a much nicer UI/UX when requesting the user to confirm
  // their password if we know if the terminal is displayed.  We add state
  // handlers here to track that.
  withStateHandlers(
    { terminalIsMounted: false },
    {
      terminalHasMounted: () => () => ({
        terminalIsMounted: true,
      }),
      terminalHasUnmounted: () => () => ({
        terminalIsMounted: false,
      }),
    },
  ),

  branch(
    ({ ssoUser }) => ssoUser == null,
    renderComponent(() => <NestedNotLoggedInError />),
  ),

  branch(
    ({ confirmingPassword, confirmPasswordFormManuallyShown, ssoTokenMatured }) => {
      return ssoTokenMatured && ( !confirmingPassword || confirmPasswordFormManuallyShown );
    },
    renderComponent(() => <NestedTokenTooOld />),
  ),

  // If the terminal is not current displayed and we're confirming the user's
  // password display a spinner.
  showSpinnerUntil(
    ({ confirmingPassword, ssoTokenMatured, terminalIsMounted }) => {
      if (ssoTokenMatured && confirmingPassword && !terminalIsMounted) {
        return false;
      }
      return true;
    }
  ),

  // Display a spinner whilst were waiting on various data requests to
  // complete.
  showSpinnerUntil(
    ({ centerUser, centerUserRetrieval, servicesRetrieval }) => {
      const waitingOnCenterUser = !centerUserRetrieval.initiated
        || centerUserRetrieval.pending;
      const centerUserPresent = centerUser != null;
      const waitingOnServices = !servicesRetrieval.initiated
        || servicesRetrieval.pending;

      return !waitingOnCenterUser && (!centerUserPresent || !waitingOnServices);
    }
  ),

  branch(
    ({ centerUser }) => centerUser == null,
    renderComponent(() => <NestedNoCenterAccount />),
  ),

  branch(
    ({ centerUser }) => centerUser.role === 'viewer',
    renderComponent(() => <NestedCenterAccountIsViewerError />),
  ),

  branch(
    ({ servicesRetrieval }) => servicesRetrieval.rejected,
    renderComponent(() => <NestedLoadError />),
  ),

  branch(
    ({ cluster, site }) => !cluster && !site,
    renderComponent(() => <Redirect to="/" />),
  ),

  // All of our edge cases are dealt with, we're ready to display the
  // terminal.  We track whether it is mounted or not here.
  lifecycle({
    componentDidMount: function componentDidMount() {
      this.props.terminalHasMounted();
    },

    componentWillUnmount: function componentDidMount() {
      this.props.terminalHasUnmounted();
    },
  }),
);

export default enhance(TerminalPage);
