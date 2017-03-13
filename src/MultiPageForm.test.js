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

it('calls props.onShowNextPage when the Next button is clicked', () => {
  const handleShowNextPage = jest.fn();
  const wrapper = shallow(
    <MultiPageForm
      pages={[
        () => <div>page 1</div>,
        () => <div>page 2</div>,
      ]}
      handleSubmit={() => {}}
      onShowNextPage={handleShowNextPage}
      submitButtonContent="Submit"
    />,
  );
  const nextButton = wrapper.find(Button).last();

  nextButton.simulate('click');

  expect(handleShowNextPage).toHaveBeenCalledTimes(1);
});

it('calls props.onShowPreviousPage when the Previous button is clicked', () => {
  const handleShowPreviousPage = jest.fn();
  const wrapper = shallow(
    <MultiPageForm
      currentPageIndex={1}
      pages={[
        () => <div>page 1</div>,
        () => <div>page 2</div>,
      ]}
      handleSubmit={() => {}}
      onShowPreviousPage={handleShowPreviousPage}
      submitButtonContent="Submit"
    />,
  );
  const previousButton = wrapper.find(Button).first();

  previousButton.simulate('click');

  expect(handleShowPreviousPage).toHaveBeenCalledTimes(1);
});

describe('showing the correct page', () => {
  const pages = [
    () => <div>page 1</div>,
    () => <div>page 2</div>,
    () => <div>page 3</div>,
  ];

  pages.forEach((page, index) => {
    it(`renders the correct page when props.currentPageIndex = ${index}`, () => {
      const wrapper = shallow(
        <MultiPageForm
          currentPageIndex={index}
          pages={pages}
          handleSubmit={() => {}}
          submitButtonContent="Submit"
        />,
      );

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
      currentPageIndex={1}
      pages={pages}
      handleSubmit={() => {}}
      submitButtonContent="My submit button"
    />,
  );
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

test('previous button is disabled on the first page', () => {
  const wrapper = shallow(
    <MultiPageForm
      currentPageIndex={0}
      pages={[
        () => <div>page 1</div>,
        () => <div>page 2</div>,
      ]}
      handleSubmit={() => {}}
      submitButtonContent="Submit"
    />,
  );
  const previousButton = wrapper.find(Button).first();

  expect(previousButton).toBeDisabled();
});

test('previous button is not disabled on subsequent pages', () => {
  const wrapper = shallow(
    <MultiPageForm
      currentPageIndex={1}
      pages={[
        () => <div>page 1</div>,
        () => <div>page 2</div>,
      ]}
      handleSubmit={() => {}}
      submitButtonContent="Submit"
    />,
  );
  const previousButton = wrapper.find(Button).first();

  expect(previousButton).not.toBeDisabled();
});

it('does not show a Next button on the final page', () => {
  const pages = [
    () => <div>page 1</div>,
    () => <div>page 2</div>,
  ];

  const wrapper = shallow(
    <MultiPageForm
      currentPageIndex={1}
      pages={pages}
      handleSubmit={() => {}}
      submitButtonContent="My submit button"
    />,
  );
  const submitButton = wrapper.find(Button).last()

  expect(submitButton.dive()).not.toIncludeText('Next');
});

it('shows a Next button on non-final pages', () => {
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
  const submitButton = wrapper.find(Button).last()

  expect(submitButton.dive()).toIncludeText('Next');
});

