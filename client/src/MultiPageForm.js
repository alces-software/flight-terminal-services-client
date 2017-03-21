/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import invariant from 'invariant';

class MultiPageForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    currentPageIndex: PropTypes.number,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onShowNextPage: PropTypes.func,
    onShowPreviousPage: PropTypes.func,
    pages: PropTypes.arrayOf(PropTypes.shape({
      render: PropTypes.func.isRequired,
      valid: PropTypes.func,
    }).isRequired).isRequired,
    submitButtonContent: PropTypes.node.isRequired,
    submittingButtonContent: PropTypes.node.isRequired,
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    currentPageIndex: 0,
    submittingButtonContent: "Submitting",
  };

  showNextPage = () => {
    if (this.props.onShowNextPage) {
      this.props.onShowNextPage();
    }
  }

  showPreviousPage = () => {
    if (this.props.onShowPreviousPage) {
      this.props.onShowPreviousPage();
    }
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
      bsStyle: 'success',
    };

    if (this.props.currentPageIndex === this.props.pages.length - 1) {
      return (
        <Button key="submitForm" {...commonProps} >
          {
            submitting
              ? this.props.submittingButtonContent
              : this.props.submitButtonContent
          }
        </Button>
      );
    }
    return (
      <Button key="nextPage" onClick={this.showNextPage} {...commonProps} >
        Next
      </Button>
    );
  }

  renderButtons() {
    return (
      <ButtonToolbar>
        <Button
          key="previousPage"
          disabled={this.props.currentPageIndex === 0}
          onClick={this.showPreviousPage}
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
    return (
      <form className={this.props.className} onSubmit={this.props.handleSubmit} >
        {this.renderPage()}
        {this.renderButtons()}
      </form>
    );
  }
}

export default MultiPageForm;
