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
    onShowNextPage: PropTypes.func,
    onShowPreviousPage: PropTypes.func,
    pages: PropTypes.arrayOf(PropTypes.shape({
      render: PropTypes.func.isRequired,
      valid: PropTypes.func,
    }).isRequired).isRequired,
    submitButtonContent: PropTypes.node.isRequired,
  };

  static defaultProps = {
    currentPageIndex: 0,
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

  renderSubmitOrNextButton() {
    const currentPage = this.props.pages[this.props.currentPageIndex];
    const disabled = currentPage.valid != null ? !currentPage.valid() : false;

    if (this.props.currentPageIndex === this.props.pages.length - 1) {
      return (
        <Button key="submitForm" type="submit" bsStyle="success" disabled={disabled} >
          {this.props.submitButtonContent}
        </Button>
      );
    }
    return (
      <Button key="nextPage" bsStyle="success" onClick={this.showNextPage} disabled={disabled} >
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
