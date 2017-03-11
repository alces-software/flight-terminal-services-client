/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import ClusterFormInput from './ClusterFormInput';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ClusterFormInput id="" placeholder="" />, div);
});

it('stores the input text in its state', () => {
  const wrapper = mount(
    <ClusterFormInput id="" placeholder="" />
  );
  expect(wrapper).not.toHaveState('value', 'some text');

  wrapper.find('input').first().simulate('change', {target: {value: 'some text'}});

  expect(wrapper).toHaveState('value', 'some text');
});

it('has the input text match its state', () => {
  const wrapper = mount(
    <ClusterFormInput id="" placeholder="" />
  );
  expect(wrapper.find('input').get(0).value).not.toEqual('some text');

  wrapper.setState({ value: 'some text' });

  expect(wrapper.find('input').get(0).value).toEqual('some text');
});

describe('validation state', () => {
  const validationStates = {
    'bad input': 'error',
    'acceptable input': 'warning',
    'good input': 'success',
  };

  const validate = (value) => {
    return validationStates[value];
  };

  Object.keys(validationStates).forEach(key => {
    const expectedValidationState = validationStates[key];
    it(`sets ${expectedValidationState} state correctly`, () => {
      const wrapper = mount(
        <ClusterFormInput id="" placeholder="" validate={validate} />
      );
      expect(wrapper.find(`.has-${expectedValidationState}`)).toBeEmpty();

      wrapper.setState({ value: key });

      expect(wrapper.find(`.has-${expectedValidationState}`)).not.toBeEmpty();
    });
  });
});
