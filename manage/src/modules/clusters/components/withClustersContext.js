import React from 'react';
import { Redirect } from 'react-router';
import { branch, compose, lifecycle, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { renderRoutes } from 'react-router-config';

import launchUsers from '../../launchUsers';

import * as actions from '../actions';

const ClustersContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  connect(createStructuredSelector({
    user: launchUsers.selectors.currentUser,
  })),

  branch(
    ({ user }) => !user,
    renderComponent(() => <Redirect to={'/'} />),
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, user } = this.props;
      if (user != null) {
        const request = dispatch(actions.loadClustersConsumingCredits(user));
        if (request) {
          request.catch(error => error);
        }
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      const { dispatch, user } = this.props;
      const nextUserId = ( nextProps.user || {} ).id;
      const thisUserId = ( user || {} ).id;
      if (nextUserId !== thisUserId) {
        const request = dispatch(actions.loadClustersConsumingCredits(nextProps.user));
        if (request) {
          request.catch(error => error);
        }
      }
    },
  }),
);

export default enhance(ClustersContext);
