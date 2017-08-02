/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { toClass, withProps, wrapDisplayName } from 'recompose';

import FlightConfirmation from './FlightConfirmation';

export default function withConfirmation(config) {
  return (WrappedComponent) => {
    // eslint-disable-next-line no-param-reassign
    WrappedComponent = toClass(WrappedComponent);

    class Wrapper extends React.Component {
      state = {
        submitting: false,
        showingConfirmation: false,
      };

      handleShowConfirmation = (...args) => {
        this.setState({ showingConfirmation: true });
        if (this.props.onConfirmationShown) {
          this.props.onConfirmationShown(...args);
        }
      }

      handleHideConfirmation = () => {
        this.setState({ showingConfirmation: false });
      }

      handleConfirmation = (...args) => {
        this.handleHideConfirmation();
        this.setState({ submitting: true });

        // We don't need to add a `then` handler as component will no longer be
        // mounted once the promise has resolved. Calling setState on an unmounted
        // component does nothing but fill the console with warning messages.
        return this.props.onConfirm(...args)
          .catch((e) => {
            this.setState({ submitting: false });
            Promise.reject(e);
          });
      }

      render() {
        const {
          confirmButtonText,
          confirmText,
          placement,
          id,

          /* eslint-disable no-unused-vars */
          onConfirm,
          onConfirmationShown,
          /* eslint-enable no-unused-vars */

          ...rest,
        } = this.props;

        const confirmationPopover = (
          <FlightConfirmation
            confirmText={confirmButtonText}
            onConfirmation={this.handleConfirmation}
            onHide={this.handleHideConfirmation}
            placement={placement}
            show={this.state.showingConfirmation}
            target={id}
          >
            {confirmText}
          </FlightConfirmation>
        );

        return (
          <WrappedComponent
            {...rest}
            confirmationPopover={confirmationPopover}
            id={id}
            onClick={this.handleShowConfirmation}
            ref={(el) => { this.button = el; }}
            showingConfirmation={this.state.showingConfirmation}
            submitting={this.state.submitting}
          />
        );
      }
    }

    Wrapper.propTypes = {
      confirmButtonText: FlightConfirmation.propTypes.confirmText,
      confirmText: FlightConfirmation.propTypes.children,
      id: PropTypes.string.isRequired,
      onConfirm: PropTypes.func.isRequired,
      onConfirmationShown: PropTypes.func,
      placement: FlightConfirmation.propTypes.placement,
    };

    Wrapper.displayName = wrapDisplayName(
      WrappedComponent,
      'withConfirmation',
    );

    return withProps(config)(Wrapper);
  };
}
