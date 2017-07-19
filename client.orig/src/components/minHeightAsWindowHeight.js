/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import windowSize from 'react-window-size';

// Wrap WrappedComponent in a div with a minHeight of the viewports height -
// borderHeights.
const minHeightAsWindowHeight = ({ borderHeights }) => (WrappedComponent) => {
  const Wrapper = ({ windowHeight, ...rest }) => {
    const minHeight = windowHeight - borderHeights;

    return (
      <div style={{ minHeight: minHeight }}>
        <WrappedComponent {...rest} />
      </div>
    );
  };

  return windowSize(Wrapper);
}

export default minHeightAsWindowHeight;
