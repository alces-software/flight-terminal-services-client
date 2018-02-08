/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Label, FormGroup, Input as ReactstrapInput, FormText } from 'reactstrap';

class Input extends React.Component {
  static defaultProps = {
    autofocus: false,
    type: 'text',
  };

  static propTypes = {
    autofocus: PropTypes.bool.isRequired,
    error: PropTypes.string,
    help: PropTypes.node,
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    optional: PropTypes.bool,
    placeholder: PropTypes.string,
    tip: PropTypes.node,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  state = {
    touched: false,
  };

  componentDidMount() {
    if (this.props.autofocus) {
      this.inputEl.focus();
    }
  }

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
    } else if ( this.props.error ) {
      return false;
    } else {
      return true;
    }
  }

  blur() {
    this.inputEl.blur();
  }

  render() {
    const { id, placeholder, type } = this.props;
    return (
      <FormGroup
        className="Input"
      >
        <Label
          className="form-control-label"
          for={id}
        >
          {this.props.label}
        </Label>
        <ReactstrapInput
          id={id}
          innerRef={(inputEl) => { this.inputEl = inputEl; }}
          onChange={this.handleChange}
          placeholder={placeholder}
          type={type}
          valid={this.getValidationState()}
          value={this.props.value}
        />
        {
          this.props.optional
            ? <Badge className="optional-label" color="success">optional</Badge> // eslint-disable-line react/jsx-max-props-per-line
            : null
        }
        {
          this.props.help
            ? <FormText className="c-para" muted >{this.props.help}</FormText> // eslint-disable-line react/jsx-max-props-per-line
            : null
        }
        {
          this.state.touched && this.props.tip
            ? this.props.tip
            : null
        }
      </FormGroup>
    );
  }
}

export default Input;
