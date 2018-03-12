import React from 'react';
import { Redirect } from 'react-router';
import { branch, compose, lifecycle, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { renderRoutes } from 'react-router-config';
import { auth, showSpinnerUntil } from 'flight-reactware';

import launchUsers from '../../launchUsers';

import * as actions from '../actions';

const PaymentsContext = ({ route }) => {
  return renderRoutes(route.routes);
};

function periodicallyLoadPayments() {
  const { dispatch, user } = this.props;

  if (user != null) {
    catchingErrors(dispatch(actions.loadPaymentsUsingCredits(user)));
  }

  this.setTimeoutId = setTimeout(
    periodicallyLoadPayments.bind(this),
    60 * 1000,
  );
}

// XXX Move this to a utils module.
function catchingErrors(promise) {
  if (promise) {
    promise.catch((error) => {
      console.log('error:', error);  // eslint-disable-line no-console
      return error;
    });
  }
  return promise;
}

const enhance = compose(
  connect(createStructuredSelector({
    authUser: auth.selectors.currentUserSelector,
    user: launchUsers.selectors.currentUser,
    userRetrieval: launchUsers.selectors.retrieval,
  })),

  branch(
    ({ authUser }) => !authUser,
    renderComponent(() => <Redirect to={'/'} />),
  ),

  showSpinnerUntil(
    ({ userRetrieval }) => userRetrieval.initiated && !userRetrieval.pending
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { user } = this.props;
      if (user != null) {
        periodicallyLoadPayments.bind(this)();
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      const { user } = this.props;
      const nextUserId = ( nextProps.user || {} ).id;
      const thisUserId = ( user || {} ).id;
      if (nextUserId !== thisUserId) {
        if (this.setTimeoutId != null) {
          clearTimeout(this.setTimeoutId);
          this.setTimeoutId = undefined;
        }
        if (nextProps.user) {
          periodicallyLoadPayments.bind(this)();
        }
      }
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this.setTimeoutId != null) {
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = undefined;
      }
    },
  }),
);

export default enhance(PaymentsContext);
