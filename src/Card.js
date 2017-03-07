/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Software Ltd.
 *
 * This file is part of Alces Flight Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import CardTitle from './CardTitle';
import CardTitleLogo from './CardTitleLogo';
import CardFooterIcon from './CardFooterIcon';
import CardFooterIcons from './CardFooterIcons';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  titleIcon: PropTypes.node,
  titleLogoOnRight: PropTypes.bool.isRequired,
  titleLogoUrl: PropTypes.string,
  footer: PropTypes.node,
  title: PropTypes.node.isRequired,
  titlePopoverText: PropTypes.node,
  titleSize: CardTitle.propTypes.titleSize,
  subtitle: PropTypes.node,
  subtitleSize: CardTitle.propTypes.subtitleSize,
};

const defaultProps = {
  titleLogoOnRight: false,
};

const Card = ({
  children,
  className,
  onClick,
  footer,
  subtitle,
  subtitleSize,
  title,
  titleIcon,
  titleLogoOnRight,
  titleLogoUrl,
  titlePopoverText,
  titleSize,
}) => {
  const cardClassNames = classNames('card', className, {
    'card--logo-right': titleLogoOnRight,
  });

  return (
    <div className="card-wrapper" >
      { /* eslint-disable jsx-a11y/no-static-element-interactions */ }
      <div className={cardClassNames} onClick={onClick} >
        <div className="card-block">
          <CardTitle
            title={title}
            titleSize={titleSize}
            titlePopoverText={titlePopoverText}
            subtitle={subtitle}
            subtitleSize={subtitleSize}
            logoUrl={titleLogoUrl}
            icon={titleIcon}
          />
          {children}
          {
            footer ? <div className="card-footer">
              {footer}
            </div>
            :
          null
          }
        </div>
      </div>
    </div>
  );
};

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

Card.Title = CardTitle;
Card.TitleLogo = CardTitleLogo;
Card.FooterIcon = CardFooterIcon;
Card.FooterIcons = CardFooterIcons;

export default Card;
