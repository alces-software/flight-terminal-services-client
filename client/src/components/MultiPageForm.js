/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'reactstrap';
import invariant from 'invariant';

import withConfirmation from './withConfirmation';
// XXX
// import '../styles/MultiPageForm.scss';

const ConfirmableButton = withConfirmation()(({
  children,
  confirmationPopover,
  showingConfirmation,
  submitting,
  ...props,
}) => {
  return (
    <Button {...props} >
      {children}
      {confirmationPopover}
    </Button>
  );
});

class MultiPageForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    confirmButtonText: PropTypes.string,
    confirmText: PropTypes.node,
    currentPageIndex: PropTypes.number,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onShowNextPage: PropTypes.func,
    onShowPreviousPage: PropTypes.func,
    pages: PropTypes.arrayOf(PropTypes.shape({
      render: PropTypes.func.isRequired,
      valid: PropTypes.func,
    }).isRequired).isRequired,
    submitButtonContent: PropTypes.node.isRequired,
    submitting: PropTypes.bool,
    submittingButtonContent: PropTypes.node.isRequired,
  };

  static defaultProps = {
    currentPageIndex: 0,
    submittingButtonContent: "Submitting",
  };

  handleShowNextPage = () => {
    if (this.props.onShowNextPage) {
      this.props.onShowNextPage();
    }
  }

  handleShowPreviousPage = () => {
    if (this.props.onShowPreviousPage) {
      this.props.onShowPreviousPage();
    }
  }

  requiresConfirmation() {
    return this.props.onConfirm != null;
  }

  renderCancelButton() {
    if (this.props.onCancel) {
      return (
        <Button
          className="pull-right"
          key="cancelButton"
          onClick={this.props.onCancel}
        >
          Cancel
        </Button>
      );
    }
    return null;
  }

  renderSubmitOrNextButton() {
    const currentPage = this.props.pages[this.props.currentPageIndex];
    const disabled = currentPage.valid != null ? !currentPage.valid() : false;
    const submitting = this.props.submitting;

    const commonProps = {
      disabled: disabled || submitting,
      type: 'submit',
      color: 'success',
    };

    if (this.props.currentPageIndex === this.props.pages.length - 1) {
      let ButtonComponent;
      let extraProps;
      if (this.requiresConfirmation()) {
        ButtonComponent = ConfirmableButton;
        extraProps = {
          confirmButtonText: this.props.confirmButtonText,
          confirmText: this.props.confirmText,
          onConfirm: this.props.onConfirm,
        };
      } else {
        ButtonComponent = Button;
        extraProps = {};
      }

      return (
        <ButtonComponent
          key="submitForm"
          {...commonProps}
          {...extraProps}
        >
          {
            submitting
              ? this.props.submittingButtonContent
              : this.props.submitButtonContent
          }
        </ButtonComponent>
      );
    }
    return (
      <Button
        key="nextPage"
        onClick={this.handleShowNextPage}
        {...commonProps}
      >
        Next
      </Button>
    );
  }

  renderButtons() {
    return (
      <ButtonToolbar>
        <Button
          disabled={this.props.currentPageIndex === 0}
          key="previousPage"
          onClick={this.handleShowPreviousPage}
        >
          Previous
        </Button>
        {this.renderSubmitOrNextButton()}
        {this.renderCancelButton()}
      </ButtonToolbar>
    );
  }

  renderPage()  {
    const currentPageIndex = this.props.currentPageIndex;
    const page = this.props.pages[currentPageIndex]; 
    invariant(page, 'Page %s has not been configured', currentPageIndex);
    return page.render();
  }

  render() {
    let onSubmit;
    if (this.requiresConfirmation()) {
      onSubmit = (event) => { event.preventDefault(); };
    } else {
      onSubmit = this.props.handleSubmit;
    }

    return (
      <form
        className={this.props.className}
        onSubmit={onSubmit}
      >
        <div className="MultiPageForm-contents">
          {this.renderPage()}
        </div>
        {this.renderButtons()}
      </form>
    );
  }
}

export default MultiPageForm;
