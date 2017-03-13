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
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    validate: PropTypes.func,
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
    if (this.props.validate == null) {
      return undefined;
    }
    return this.props.validate({ ...this.state, value: this.props.value });
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
          value={this.props.value}
        />
      </FormGroup>
    );
  }
}

export default ClusterFormInput;
