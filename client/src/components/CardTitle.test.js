/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import CardTitle from './CardTitle';
import { withSilencedPropTypeWarnings } from '../testUtils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardTitle title="My title" subtitle="Subtitle" />, div);
});

describe('title sizes', () => {
  const titleSizesToHeights = {
    'medium': 'h4',
    'large': 'h2',
    'x-large': 'h1',
  };

  it('renders x-large titles by default', () => {
    const wrapper = shallow(
      <CardTitle title="My title" subtitle="Subtitle" />
    );
    const defaultSize = 'x-large';

    expect(wrapper.find('.card-title')).toHaveTagName(titleSizesToHeights[defaultSize]);
  });

  Object.keys(titleSizesToHeights).forEach((size) => {
    it(`renders the correct title element for size ${size}`, () => {
      const sizeProp = size === 'undefined' ? {} : { titleSize: size };
      const wrapper = shallow(
        <CardTitle title="My title" subtitle="Subtitle" {...sizeProp} />
      );

      expect(wrapper.find('.card-title')).toHaveTagName(titleSizesToHeights[size]);
    });
  });

  it('does not crash when given an invalid titleSize', () => {
    withSilencedPropTypeWarnings(1, () => {
      const div = document.createElement('div');
      ReactDOM.render(<CardTitle title="My title" subtitle="Subtitle" titleSize="not_valid" />, div);
    });
  });
});

describe('subtitle sizes', () => {
  const subtitleSizesToHeights = {
    'medium': 'h6',
    'large': 'h5',
    'x-large': 'h4',
  };

  it('renders x-large subtitles by default', () => {
    const wrapper = shallow(
      <CardTitle title="My title" subtitle="Subtitle" />
    );
    const defaultSize = 'x-large';

    expect(wrapper.find('.card-subtitle')).toHaveTagName(subtitleSizesToHeights[defaultSize]);
  });

  Object.keys(subtitleSizesToHeights).forEach((size) => {
    it(`renders the correct subtitle element for size ${size}`, () => {
      const sizeProp = size === 'undefined' ? {} : { subtitleSize: size };
      const wrapper = shallow(
        <CardTitle title="My title" subtitle="Subtitle" {...sizeProp} />
      );

      expect(wrapper.find('.card-subtitle')).toHaveTagName(subtitleSizesToHeights[size]);
    });
  });

  it('does not crash when given an invalid subtitleSize', () => {
    withSilencedPropTypeWarnings(1, () => {
      const div = document.createElement('div');
      ReactDOM.render(<CardTitle title="My title" subtitle="Subtitle" subtitleSize="not_valid" />, div);
    });
  });
});

describe('title attribute', () => {
  it('sets a title attribute when title prop is a string', () => {
    const wrapper = shallow(
      <CardTitle title="My title" subtitle="Subtitle" />
    );

    expect(wrapper.find('.card-title')).toHaveProp('title', 'My title');
  });

  it('does not set a title attribute when title prop is a react node', () => {
    // This behaviour prevents the title being set to `[Object object]`.
    // Ideally, we'd extract the text from the title prop.
    const wrapper = shallow(
      <CardTitle title={<span>My title</span>} subtitle="Subtitle" />
    );

    expect(wrapper.find('.card-title')).not.toHaveProp('title', 'My title');
  });
});
