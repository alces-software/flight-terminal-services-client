/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';

const propTypes = {
  logoUrl: PropTypes.string,
};

class CardTitleLogo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showImage: false,
    };
    this.showImage = () => this.setState({ showImage: true });
  }

  render() {
    const { logoUrl } = this.props;

    const style = {
      display: this.state.showImage ? 'initial' : 'none',
    };

    return (
      logoUrl ? <img
        className="card-title-logo"
        role="presentation"
        src={logoUrl}
        style={style}
        onLoad={this.showImage}
      />
      : null
    );
  }
}

CardTitleLogo.propTypes = propTypes;

export default CardTitleLogo;
