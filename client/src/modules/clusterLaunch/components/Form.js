/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FontAwesome from 'react-fontawesome';

import tokens from '../../../modules/tokens';
import { MultiPageForm } from 'flight-reactware';
import { clusterSpecShape } from '../../../modules/clusterSpecs/propTypes';

import ClusterNameInput from './ClusterNameInput';
import CollectionOptions from './CollectionOptions';
import EmailInput from './EmailInput';
import LaunchConfirmationText from './LaunchConfirmationText';
import LaunchOptions from './LaunchOptions';
import QueuesConfiguration from './QueuesConfiguration';
import TokenInput from './TokenInput';
import { getDefaultClusterName, getDefaultEmail, useCredits } from '../utils';

const cardHeight = 360;
const titleAndButtonsHeight = 156;
const formHeight = `${cardHeight - titleAndButtonsHeight}px`;

export class ClusterLaunchForm extends React.Component {
  static propTypes = {
    clusterSpec: clusterSpecShape.isRequired,
    collections: CollectionOptions.propTypes.collections,
    currentPageIndex: PropTypes.number.isRequired,
    emailRef: PropTypes.func,
    errors: PropTypes.shape({
      clusterName: PropTypes.any,
      email: PropTypes.any,
      launchToken: PropTypes.any,
    }),
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onQueueChange: PropTypes.func.isRequired,
    onShowNextPage: PropTypes.func.isRequired,
    onShowPreviousPage: PropTypes.func.isRequired,
    onTokenEntered: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    token: PropTypes.shape({
      attributes: PropTypes.shape({
        assignedTo: PropTypes.string
      }).isRequired,
    }),
    tokenHasLoaded: PropTypes.bool,
    tokenName: PropTypes.string,
    values: PropTypes.shape({
      clusterName: PropTypes.string,
      email: PropTypes.string,
      launchToken: PropTypes.string,
      queues: PropTypes.object.isRequired,
      selectedCollection: PropTypes.string,
      selectedLaunchOptionIndex: PropTypes.number,
    }),
  };

  pages = () => [
    {
      render: () => (
        <TokenInput
          error={this.props.errors.launchToken}
          id={this.props.clusterSpec.ui.title}
          onChange={this.props.onChange}
          value={this.props.values.launchToken}
        />
      ),
      skip: () => useCredits(this.props),
      valid: () => (
        useCredits(this.props) ? true : !this.props.errors.launchToken
      ),
    },
    {
      render: () => (
        <LaunchOptions
          clusterSpec={this.props.clusterSpec}
          onChange={this.props.onChange}
          selectedLaunchOptionIndex={this.props.values.selectedLaunchOptionIndex}
          tokenName={this.props.tokenName}
          useCredits={useCredits(this.props)}
        />),
      valid: () => (
        useCredits(this.props) ? true : this.props.tokenHasLoaded
      ),
    },
    {
      render: () => (
        <CollectionOptions
          collections={this.props.collections}
          onChange={this.props.onChange}
          selectedCollection={this.props.values.selectedCollection}
        />),
      skip: () => !this.props.clusterSpec.features.forgeCollections,
      valid: () => true,
    },
    {
      render: () => (
        <QueuesConfiguration
          onChange={this.props.onQueueChange}
          queues={this.props.values.queues}
        />),
      valid: () => true,
    },
    {
      render: () => (
        <ClusterNameInput
          error={this.props.errors.clusterName}
          id={this.props.clusterSpec.ui.title}
          onChange={this.props.onChange}
          placeholder={getDefaultClusterName(this.props.values)}
          value={this.props.values.clusterName}
        />),
      valid: () => !this.props.errors.clusterName,
    },
    {
      render: () => (
        <EmailInput
          error={this.props.errors.email}
          id={this.props.clusterSpec.ui.title} 
          inputRef={this.props.emailRef}
          onChange={this.props.onChange}
          placeholder={getDefaultEmail(this.props)}
          value={this.props.values.email}
        />
      ),
      valid: () => !this.props.errors.email,
    },
  ].filter(pg => pg.skip == null || !pg.skip());

  handleShowNextPage = () => {
    const indexOfTokenPage = 0;
    const leavingTokenPage = this.props.currentPageIndex === indexOfTokenPage &&
      !useCredits(this.props) ;
    if (leavingTokenPage) {
      this.props.onTokenEntered();
    }
    this.props.onShowNextPage();
  }

  render() {
    return (
      <MultiPageForm
        confirmButtonText="Launch"
        confirmText={
          <LaunchConfirmationText useCredits={useCredits(this.props)} />
        }
        currentPageIndex={this.props.currentPageIndex}
        // eslint-disable-next-line react/jsx-handler-names
        handleSubmit={this.props.handleSubmit}
        height={formHeight}
        id={`clusterLaunchForm-${this.props.clusterSpec.key}`}
        onCancel={this.props.onCancel}
        onConfirm={this.props.handleSubmit}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.props.onShowPreviousPage}
        pages={this.pages()}
        submitButtonContent={<span>Launch{' '}<FontAwesome name="plane" /></span>}
        submitting={this.props.submitting}
        submittingButtonContent={<span>
          Launching&hellip;{' '}
          <FontAwesome
            name="spinner"
            spin
          />
        </span>}
      />
    );
  }
}

export default connect(createStructuredSelector({
  tokenHasLoaded: tokens.selectors.hasLoaded,
  token: tokens.selectors.tokenFromName,
}))(ClusterLaunchForm);
