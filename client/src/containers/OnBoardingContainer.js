/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';

import { loadState, saveState } from '../utils/persistence';
import WelcomeMessageModal from '../components/WelcomeMessageModal';
import awsCredentialsAllowed from '../utils/awsCredentialsAllowed';

export default class OnBoardingContainer extends React.Component {
  state = {
    awsCredentialsAllowed: false,
    showWelcomeMessage: false,
  };

  setWelcomeMessageRead = () => {
    this.setState({ showWelcomeMessage: false });
    saveState({ onboarding: { welcomeMessageRead: true } });
  }

  showWelcomeMessage() {
    this.setState({ showWelcomeMessage: true });
  }

  componentDidMount() {
    const state = loadState();
    if (state == null || state.onboarding == null) {
      this.setState({
        awsCredentialsAllowed: awsCredentialsAllowed(),
        showWelcomeMessage: true,
      });
    } else {
      this.setState({
        awsCredentialsAllowed: awsCredentialsAllowed(),
        showWelcomeMessage: !state.onboarding.welcomeMessageRead,
      });
    }
  }

  render() {
    return (
      <WelcomeMessageModal
        awsCredentialsAllowed={this.state.awsCredentialsAllowed}
        show={this.state.showWelcomeMessage}
        onHide={this.setWelcomeMessageRead}
      />
    );
  }
}
