/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import { FormGroup, FormControl } from 'react-bootstrap';

class ClusterFormInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    validate: PropTypes.func,
  };

  state = {
    value: ''
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  getValidationState() {
    if (this.props.validate == null) {
      return undefined;
    }
    return this.props.validate(this.state.value);
  }

  render() {
    const { id, placeholder } = this.props;
    return (
      <FormGroup
        controlId={`cluster-launch-${id}`}
        validationState={this.getValidationState()}
      >
        <FormControl
          type="text"
          placeholder={placeholder}
          onChange={this.handleChange}
          value={this.state.value}
        />
      </FormGroup>
    );
  }
}

export default ClusterFormInput;
