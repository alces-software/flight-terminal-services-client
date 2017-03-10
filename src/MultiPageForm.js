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
    handleSubmit: PropTypes.func.isRequired,
    pages: PropTypes.arrayOf(PropTypes.func.isRequired).isRequired,
    submitButtonContent: PropTypes.node.isRequired,
  };

  state = {
    page: 0,
  };

  showNextPage = () => {
    this.setState({ page: this.state.page + 1 });
  }

  showPreviousPage = () => {
    this.setState({ page: this.state.page - 1 });
  }

  renderSubmitOrNextButton() {
    if (this.state.page === this.props.pages.length - 1) {
      return (
        <Button key="submitForm" type="submit" bsStyle="success">
          {this.props.submitButtonContent}
        </Button>
      );
    }
    return (
      <Button key="nextPage" bsStyle="success" onClick={this.showNextPage} >
        Next
      </Button>
    );
  }

  renderButtons() {
    return (
      <ButtonToolbar>
        <Button
          key="previousPage"
          disabled={this.state.page === 0}
          onClick={this.showPreviousPage}
        >
          Previous
        </Button>
        {this.renderSubmitOrNextButton()}
      </ButtonToolbar>
    );
  }

  renderPage()  {
    const page = this.props.pages[this.state.page]; 
    invariant(page, 'Page %s has not been configured', this.state.page);
    return page();
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
