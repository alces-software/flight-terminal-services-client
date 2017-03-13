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
  ReactDOM.render(<ClusterFormInput id="" name="" placeholder="" />, div);
});

it('has the input text match its prop.value', () => {
  const wrapper = mount(
    <ClusterFormInput id="" name="" placeholder="" value="my value" />
  );

  expect(wrapper.find('input').get(0).value).toEqual('my value');
});

it('calls the onChange prop when the value changes', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <ClusterFormInput id="" placeholder="" name="my name" value="my value" onChange={onChange} />
  );

  wrapper.find('input').first().simulate('change', {target: {value: 'some text'}});

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ name: "my name", value: 'some text' });
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
    it(`sets ${expectedValidationState} state correctly for touched inputs`, () => {
      const wrapper = mount(
        <ClusterFormInput id="" name="" placeholder="" error={validate(key)} value={key} />
      );
      wrapper.setState({ touched: true });

      expect(wrapper.find(`.has-${expectedValidationState}`)).not.toBeEmpty();
    });
  });

  Object.keys(validationStates).forEach(key => {
    const expectedValidationState = validationStates[key];
    it(`does not set ${expectedValidationState} state for untouched inputs`, () => {
      const wrapper = mount(
        <ClusterFormInput id="" name="" placeholder="" error={validate(key)} value={key} />
      );

      expect(wrapper.find(`.has-${expectedValidationState}`)).toBeEmpty();
    });
  });
});

xit('focuses the input if props.autofocus is set', () => {
  // This test is excluded as enzyme doesn't currently support ':focus'.
  const wrapper = mount(
    <ClusterFormInput id="" name="" placeholder="" autofocus />
  );

  expect(wrapper).toMatchSelector(':focus');
});
