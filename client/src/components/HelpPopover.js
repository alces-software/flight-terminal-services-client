import React from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverContent, PopoverTitle } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import OverlayTrigger from './OverlayTrigger';

const propTypes = {
  children: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  placement: Popover.propTypes.placement,
  title: PropTypes.string,
};

const defaultProps = {
  placement: 'top',
};

const Abbr = styled.abbr`
  border-bottom: 1px dotted;
  color: #737373;
  cursor: help;

  .fa {
    display: inline;
    height: auto;
    margin: 0 2px;
    vertical-align: unset;
    width: auto;
  }
`;

// Component to display a help popover for contained text when this is clicked.
const HelpPopover = ({ children, content, placement, title }) => {
  const popover = (
    <Popover
      placement={placement}
      {...this.props}
    >
      {title ? <PopoverTitle>{title}</PopoverTitle> : null}
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );

  return (
    <OverlayTrigger
      overlay={popover}
      trigger="click"
    >
      <Abbr>
        {children}
        <FontAwesome name="question-circle" />
      </Abbr>
    </OverlayTrigger>
  );
};

HelpPopover.propTypes = propTypes;
HelpPopover.defaultProps = defaultProps;

export default HelpPopover;
