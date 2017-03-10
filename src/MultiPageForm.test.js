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
import { Button } from 'react-bootstrap';

import MultiPageForm from './MultiPageForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MultiPageForm
      pages={[() => <div>page 1</div>]}
      handleSubmit={() => {}}
      submitButtonContent="Submit"
    />,
    div
  );
});

describe('showing the correct page', () => {
  const pages = [
    () => <div>page 1</div>,
    () => <div>page 2</div>,
    () => <div>page 3</div>,
  ];

  pages.forEach((page, index) => {
    it(`renders the correct page when state.page = ${index}`, () => {
      const wrapper = shallow(
        <MultiPageForm
          pages={pages}
          handleSubmit={() => {}}
          submitButtonContent="Submit"
        />,
      );

      for (let i = 0; i < index; i++) {
        wrapper.setState({ page: index });
      }

      expect(wrapper).toContainReact(page());
    });
  });

  pages.forEach((page, index) => {
    it(`shows the correct page when the Next button is clicked ${index} times`, () => {
      const wrapper = shallow(
        <MultiPageForm
          pages={pages}
          handleSubmit={() => {}}
          submitButtonContent="Submit"
        />,
      );

      for (let i = 0; i < index; i++) {
        const nextButton = wrapper.find(Button).last();
        nextButton.simulate('click');
      }

      expect(wrapper).toContainReact(page());
    });
  });

  pages.forEach((page, index) => {
    const numPages = pages.length;
    const numClicks = numPages - (index + 1);
    it(`shows the correct page when the Previous button is clicked ${numClicks} times`, () => {
      const wrapper = shallow(
        <MultiPageForm
          pages={pages}
          handleSubmit={() => {}}
          submitButtonContent="Submit"
        />,
      );

      wrapper.setState({ page: numPages - 1 });

      for (let i = 0; i < numClicks ; i++) {
        const previousButton = wrapper.find(Button).first();
        previousButton.simulate('click');
      }

      expect(wrapper).toContainReact(page());
    });
  });
});

it('shows the submit button on the final page', () => {
  const pages = [
    () => <div>page 1</div>,
    () => <div>page 2</div>,
  ];

  const wrapper = shallow(
    <MultiPageForm
      pages={pages}
      handleSubmit={() => {}}
      submitButtonContent="My submit button"
    />,
  );
  wrapper.setState({ page: pages.length - 1 });
  const submitButton = wrapper.find(Button).find('[type="submit"]');

  expect(submitButton.dive()).toIncludeText('My submit button');
});

it('does not show the submit button on non-final pages', () => {
  const pages = [
    () => <div>page 1</div>,
    () => <div>page 2</div>,
  ];

  const wrapper = shallow(
    <MultiPageForm
      pages={pages}
      handleSubmit={() => {}}
      submitButtonContent="My submit button"
    />,
  );
  const submitButton = wrapper.find(Button).find('[type="submit"]');

  expect(submitButton).toBeEmpty();
});
