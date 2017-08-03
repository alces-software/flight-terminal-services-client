import React from 'react';
import PropTypes from 'prop-types';

// Parts of this file are based on react-bootstrap's OverlayTrigger licensed
// under the MIT license.

function isOneOf(one, of) {
  if (Array.isArray(of)) {
    return of.indexOf(one) >= 0;
  }
  return one === of;
}

const triggerTypes = PropTypes.oneOf(['click', 'hover', 'focus']);

class OverlayTrigger extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    overlay: PropTypes.node.isRequired,
    trigger: PropTypes.oneOf(triggerTypes, PropTypes.arrayOf(triggerTypes)),
  };

  static counter = 0;

  static getId = () => {
    OverlayTrigger.counter += 1;
    return `OverlayTriggerId-${OverlayTrigger.counter}`;
  }

  constructor(...args) {
    super(...args);
    this.id = OverlayTrigger.getId();
  }

  state = {
    isOpen: false,
  }

  handleToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { children, overlay, trigger } = this.props;

    let triggerProps = {};
    if (isOneOf('click', trigger)) {
      triggerProps.onClick = this.handleToggleOpen;
    }
    if (isOneOf('hover', trigger)) {
      triggerProps.onMouseOver = this.handleToggleOpen;
      triggerProps.onMouseOut = this.handleToggleOpen;
    }
    if (isOneOf('focus', trigger)) {
      triggerProps.onFocus = this.handleToggleOpen;
      triggerProps.onBlur = this.handleToggleOpen;
    }

    return (
      <span>
        {React.cloneElement(children, {
          id: this.id,
          ...triggerProps,
        })}
        {React.cloneElement(overlay, {
          isOpen: this.state.isOpen,
          target: this.id,
        })}
      </span>
    );
  }
}

export default OverlayTrigger;
