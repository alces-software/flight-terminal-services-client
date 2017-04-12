/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import Credentials from './ClusterLaunchCredentials';

const commonProps = {
  id: "",
  onToggleUseLaunchToken: () => {},
  onChange: () => {},
  errors: {},
  values: {},
};

describe('renders without crashing', () => {
  const wrapperVariants = [
    { useLaunchToken: true, showAwsCredentialsLink: true },
    { useLaunchToken: true, showAwsCredentialsLink: false },
    { useLaunchToken: false, showAwsCredentialsLink: true },
  ];

  wrapperVariants.forEach((variantProps, variantIndex) => {
    test(`variant ${variantIndex}`, () => {
      const div = document.createElement('div');
      ReactDOM.render(<Credentials {...commonProps} {...variantProps} />, div);
    });
  });
});


it('shows the credentials link when it should', () => {
  const wrapper = shallow(
    <Credentials
      {...commonProps}
      useLaunchToken
      showAwsCredentialsLink
    />
  );

  expect(wrapper.find('a')).toHaveText('use my AWS credentials');
});

it('hides the credentials link when it should', () => {
  const wrapper = shallow(
    <Credentials
      {...commonProps}
      useLaunchToken
      showAwsCredentialsLink={false}
    />
  );

  expect(wrapper.find('a')).toBeEmpty();
});
