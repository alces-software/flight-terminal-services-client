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
import styled from 'styled-components';

import withConfirmation from './withConfirmation';

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

const cardHeight = 360;
const titleAndButtonsHeight = 156;
const Contents = styled.div`
  height: ${cardHeight - titleAndButtonsHeight}px;
`;

class MultiPageForm extends React.Component {
  static propTypes = {
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
          className="ml-auto"
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
      className: "ml-1",
      color: 'success',
      disabled: disabled || submitting,
      type: 'submit',
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
      <form onSubmit={onSubmit} >
        <Contents>
          {this.renderPage()}
        </Contents>
        {this.renderButtons()}
      </form>
    );
  }
}

export default MultiPageForm;
