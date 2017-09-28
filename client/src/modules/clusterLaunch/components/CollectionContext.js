/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import { auth } from 'flight-reactware';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import users from '../../users';

const CollectionContext = ({ children }) => children;

const enhance = compose(
  connect(createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector,
  })),

  lifecycle({
    componentDidMount: function componentDidMount() {
      let request;
      const { currentUser, dispatch } = this.props;

      request = dispatch(users.actions.loadUser('alces'));
      if (request) {
        request.catch(e => e);
      }
      if (currentUser != null) {
        request = dispatch(users.actions.loadUser(currentUser.username));
        if (request) {
          request.catch(e => e);
        }
      }
    },
  }),
);

export default enhance(CollectionContext);
