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
import LaunchOptions from './LaunchOptions';
import TokenInput from './TokenInput';

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
    onShowNextPage: PropTypes.func.isRequired,
    onShowPreviousPage: PropTypes.func.isRequired,
    onTokenEntered: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
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
      selectedCollection: PropTypes.string,
      selectedLaunchOptionIndex: PropTypes.number,
    }),
  };

  pages = [
    {
      render: () => (
        <TokenInput
          error={this.props.errors.launchToken}
          id={this.props.clusterSpec.ui.title}
          onChange={this.props.onChange}
          value={this.props.values.launchToken}
        />),
      valid: () => !this.props.errors.launchToken,
    },
    {
      render: () => (
        <LaunchOptions
          clusterSpec={this.props.clusterSpec}
          onChange={this.props.onChange}
          selectedLaunchOptionIndex={this.props.values.selectedLaunchOptionIndex}
          tokenName={this.props.tokenName}
        />),
      valid: () => this.props.tokenHasLoaded,
    },
    {
      render: () => (
        <CollectionOptions
          collections={this.props.collections}
          onChange={this.props.onChange}
          selectedCollection={this.props.values.selectedCollection}
        />),
      valid: () => true,
    },
    {
      render: () => (
        <ClusterNameInput
          error={this.props.errors.clusterName}
          id={this.props.clusterSpec.ui.title}
          onChange={this.props.onChange}
          placeholder={this.props.values.launchToken}
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
          placeholder={
            this.props.token == null ?
              null :
              this.props.token.attributes.assignedTo
          }
          value={this.props.values.email}
        />),
      valid: () => !this.props.errors.email,
    },
  ];

  handleShowNextPage = () => {
    const indexOfTokenPage = 0;
    if (this.props.currentPageIndex === indexOfTokenPage) {
      this.props.onTokenEntered();
    }
    this.props.onShowNextPage();
  }

  render() {
    return (
      <MultiPageForm
        confirmButtonText="Launch"
        confirmText={<div>
          <p>
            You are about to launch an Alces Flight Compute HPC cluster for trial use through the
            Alces Flight Launch service.  By clicking the launch button you
            understand this is a trial service and that Alces Flight Ltd
            takes no responsibility for the work performed during the trial.
            Users are highly encouraged to save their work as once the trial
            ends they will no longer have access to their work.
          </p>
          <p>I understand and wish to continue.</p>
        </div>}
        currentPageIndex={this.props.currentPageIndex}
        // eslint-disable-next-line react/jsx-handler-names
        handleSubmit={this.props.handleSubmit}
        height={formHeight}
        id={`clusterLaunchForm-${this.props.clusterSpec.key}`}
        onCancel={this.props.onCancel}
        onConfirm={this.props.handleSubmit}
        onShowNextPage={this.handleShowNextPage}
        onShowPreviousPage={this.props.onShowPreviousPage}
        pages={this.pages}
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
