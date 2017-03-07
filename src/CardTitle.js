/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import CardTitleLogo from './CardTitleLogo';

const titleElemFromSize = (size) => {
  switch (size) {
    case 'medium':
      return 'h4';
    case 'large':
      return 'h2';
    case 'x-large':
      return 'h1';
    default:
      return 'h4';
  }
};

const subtitleElemFromSize = (size) => {
  switch (size) {
    case 'medium':
      return 'h6';
    case 'large':
      return 'h5';
    case 'x-large':
      return 'h4';
    default:
      return 'h6';
  }
};

const propTypes = {
  icon: PropTypes.node,
  logoUrl: PropTypes.string,
  title: PropTypes.node.isRequired,
  titleSize: PropTypes.oneOf(['medium', 'large', 'x-large']),
  titlePopoverText: PropTypes.string,
  subtitle: PropTypes.node.isRequired,
  subtitleSize: PropTypes.oneOf(['medium', 'large', 'x-large']),
};

const defaultProps = {
  titleSize: 'x-large',
  subtitleSize: 'x-large',
};

const CardTitle = ({
  icon,
  logoUrl,
  subtitle,
  subtitleSize,
  title,
  titlePopoverText,
  titleSize,
}) => {
  const HT = titleElemFromSize(titleSize);
  const HST = subtitleElemFromSize(subtitleSize);
  const logoOrIcon = logoUrl ?
    <CardTitleLogo logoUrl={logoUrl} /> :
    icon;

  let titleAttribute;
  if (titlePopoverText != null) {
    titleAttribute = { title: titlePopoverText };
  } else {
    titleAttribute = typeof title === 'string' ? { title } : null;
  }

  return (
    <div className="card-title-block">
      <div className="card-title-block-inner">
        <div className="card-title-logo-container">
          <div className="card-title-logo-helper" />
          {logoOrIcon}
        </div>
        <HT className={classNames('card-title', titleSize)} {...titleAttribute}>
          {title}
        </HT>
      </div>
      <HST className={classNames('card-subtitle', subtitleSize)}>{subtitle}</HST>
    </div>
  );
};

CardTitle.propTypes = propTypes;
CardTitle.defaultProps = defaultProps;

export default CardTitle;
