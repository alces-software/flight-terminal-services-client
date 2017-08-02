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

// import '../styles/ClusterFormInput.scss';

class Input extends React.Component {
  static defaultProps = {
    autofocus: false,
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
    }
    return this.props.error;
  }

  blur() {
    this.inputEl.blur();
  }

  render() {
    const { id, placeholder } = this.props;
    return (
      <FormGroup
        className="Input"
        color={this.getValidationState()}
      >
        <Label for={id}>{this.props.label}</Label>
        <ReactstrapInput
          getRef={(inputEl) => { this.inputEl = inputEl; }}
          id={id}
          onChange={this.handleChange}
          placeholder={placeholder}
          state={this.getValidationState()}
          type="text"
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
