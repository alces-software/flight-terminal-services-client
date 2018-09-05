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

import centerUsers from '../../../modules/centerUsers';
import services from '../../../modules/services';

import CenterAccountIsViewerError from '../components/CenterAccountIsViewerError';
import LoadError from '../components/LoadError';
import NoCenterAccountError from '../components/NoCenterAccountError';
import NotLoggedInError from '../components/NotLoggedInError';
import TerminalPage from './TerminalPage';
import TokenTooOld from '../components/TokenTooOld';

const NestedLoadError = nest(Container, LoadError);
const NestedNotLoggedInError = nest(Container, NotLoggedInError);
const NestedNoCenterAccount = nest(Container, NoCenterAccountError);
const NestedCenterAccountIsViewerError = nest(Container, CenterAccountIsViewerError);
const NestedTokenTooOld = nest(Container, TokenTooOld);

const propTypes = {
  jwt: PropTypes.string.isRequired,
  site: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
  }).isRequired,
};

const env = {
  LANG: 'en_GB.UTF-8',
};

const DirectoryPage = ({ jwt, site }) => {
  return (
    <TerminalPage
      auth={{
        jwt: jwt,
        siteId: site.id,
      }}
      columns={120}
      socketIOPath={process.env.REACT_APP_TERMINAL_SERVICE_SOCKET_IO_PATH}
      socketIOUrl={process.env.REACT_APP_TERMINAL_SERVICE_URL}
      termProps={{
        env: env,
      }}
    />
  );
};

DirectoryPage.propTypes = propTypes;

const enhance = compose(
  connect(createStructuredSelector({
    centerUser: centerUsers.selectors.currentUser,
    centerUserRetrieval: centerUsers.selectors.retrieval,
    jwt: auth.selectors.ssoToken,
    servicesRetrieval: services.selectors.retrieval,
    site: services.selectors.site,
    ssoUser: auth.selectors.currentUserSelector,
    ssoTokenMatured: auth.selectors.ssoTokenMatured,
    confirmingPassword: auth.selectors.confirmingPassword,
    confirmPasswordFormManuallyShown: auth.selectors.confirmPassword.manuallyShown,
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
    ({ site }) => !site,
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

export default enhance(DirectoryPage);
