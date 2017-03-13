/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { Label, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';

import './styles/ClusterFormInput.scss';

class ClusterFormInput extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    help: PropTypes.node,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    optional: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  state = {
    touched: false,
  };

  handleChange = (event) => {
    this.setState({ touched: true });
    if (this.props.onChange) {
      this.props.onChange({
        value: event.target.value,
        name: this.props.name,
      });
    }
  }

  getValidationState() {
    if (!this.state.touched) {
      return null;
    }
    return this.props.error;
  }

  render() {
    const { id, placeholder } = this.props;
    return (
      <FormGroup
        className="ClusterFormInput"
        controlId={`cluster-launch-${id}`}
        validationState={this.getValidationState()}
      >
        <FormControl
          type="text"
          placeholder={placeholder}
          onChange={this.handleChange}
          value={this.props.value}
        />
        {
          this.props.optional
            ? <Label bsStyle="success" className="optional-label">optional</Label>
            : null
        }
        {
          this.props.help
            ? <HelpBlock>{this.props.help}</HelpBlock>
            : null
        }
      </FormGroup>
    );
  }
}

export default ClusterFormInput;
