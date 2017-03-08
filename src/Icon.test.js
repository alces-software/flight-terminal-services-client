/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import { Icon as FlightIcon } from 'flight-common';
import Icon from './Icon';
import { withSilencedPropTypeWarnings } from './testUtils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Icon iconName="test" />, div);
});

it('renders Icon from flight-common when given an iconName', () => {
  const wrapper = shallow(<Icon iconName="test" />);
  const expected = <FlightIcon name="test" size={undefined} />;
  expect(wrapper).toContainReact(expected);
});

it('renders an img tag when given an iconSrc', () => {
  const wrapper = shallow(<Icon iconSrc="test" />);
  const expected = (
    <span className="flight-icon">
      <img src="test" role="presentation" height="16px" />
    </span>
  );
  expect(wrapper.shallow()).toContainReact(expected);
});

describe('title sizes', () => {
  const sizesToHeights = {
    'undefined': '16px',
    '2x': '32px',
    '3x': '48px',
    '4x': '64px',
  };

  Object.keys(sizesToHeights).forEach((size) => {
    it(`renders the img tag with the correct height for size ${size}`, () => {
      const sizeProp = size === 'undefined' ? {} : { size: size };
      const wrapper = shallow(<Icon iconSrc="test" {...sizeProp} />);
      const expected = (
        <span className="flight-icon">
          <img src="test" role="presentation" height={sizesToHeights[size]} />
        </span>
      );
      expect(wrapper.shallow()).toContainReact(expected);
    });
  });

  it('does not crash when given an invalid size', () => {
    withSilencedPropTypeWarnings(1, () => {
      const div = document.createElement('div');
      ReactDOM.render(<Icon iconSrc="test" size="not_valid" />, div);
    });
  });
});
