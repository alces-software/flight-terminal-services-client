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
      pages={[ { render: () => <div>page 1</div> } ]}
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
        { render: () => <div>page 1</div> },
        { render: () => <div>page 2</div> },
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
        { render: () => <div>page 1</div> },
        { render: () => <div>page 2</div> },
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
    { render: () => <div>page 1</div> },
    { render: () => <div>page 2</div> },
    { render: () => <div>page 3</div> },
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

      expect(wrapper).toContainReact(page.render());
    });
  });
});

describe('submit/next button', () => {
  const validPages = [
    {
      render: () => <div>page 1</div>,
      valid: () => true,
    },
    {
      render: () => <div>page 2</div>,
      valid: () => true,
    }
  ];

  const invalidPages = [
    {
      render: () => <div>page 1</div>,
      valid: () => false,
    },
    {
      render: () => <div>page 2</div>,
      valid: () => false,
    }
  ];

  it('shows a "Next" button on non-final pages', () => {
    const wrapper = shallow(
      <MultiPageForm
        currentPageIndex={0}
        pages={validPages}
        handleSubmit={() => {}}
        submitButtonContent="My submit button"
      />,
    );
    const nextButton = wrapper.find(Button).find('[type="submit"]');

    expect(nextButton.dive()).toIncludeText('Next');
    expect(nextButton).toHaveProp('onClick');
  });

  it('shows a "submit" button on the final page', () => {
    const wrapper = shallow(
      <MultiPageForm
        currentPageIndex={1}
        pages={validPages}
        handleSubmit={() => {}}
        submitButtonContent="My submit button"
      />,
    );
    const submitButton = wrapper.find(Button).find('[type="submit"]');

    expect(submitButton.dive()).toIncludeText('My submit button');
    expect(submitButton).not.toHaveProp('onClick');
  });

  invalidPages.forEach((page, index) => {
    it(`disables button if page is invalid (page ${index})`, () => {
      const wrapper = shallow(
        <MultiPageForm
          currentPageIndex={index}
          pages={invalidPages}
          handleSubmit={() => {}}
          submitButtonContent="My submit button"
        />,
      );
      const submitButton = wrapper.find(Button).find('[type="submit"]');

      expect(submitButton.dive()).toBeDisabled();
    });
  });

  validPages.forEach((page, index) => {
    it(`enables button if page is valid (page ${index})`, () => {
      const wrapper = shallow(
        <MultiPageForm
          currentPageIndex={index}
          pages={invalidPages}
          handleSubmit={() => {}}
          submitButtonContent="My submit button"
        />,
      );
      const submitButton = wrapper.find(Button).find('[type="submit"]');

      expect(submitButton.dive()).toBeDisabled();
    });
  });

  it('disables button if props.submitting is true', () => {
    const wrapper = shallow(
      <MultiPageForm
        currentPageIndex={1}
        pages={validPages}
        handleSubmit={() => {}}
        submitButtonContent="My submit button"
        submitting
      />,
    );
    const submitButton = wrapper.find(Button).find('[type="submit"]');

    expect(submitButton.dive()).toBeDisabled();
  });

  it('uses props.submittingButtonContent if props.submitting is true', () => {
    const wrapper = shallow(
      <MultiPageForm
        currentPageIndex={1}
        pages={validPages}
        handleSubmit={() => {}}
        submitButtonContent="My submit button"
        submittingButtonContent="Submitting..."
        submitting
      />,
    );
    const submitButton = wrapper.find(Button).find('[type="submit"]');

    expect(submitButton.dive()).toIncludeText('Submitting...');
  });
});

describe('previous button', () => {
  test('previous button is disabled on the first page', () => {
    const wrapper = shallow(
      <MultiPageForm
        currentPageIndex={0}
        pages={[
          { render: () => <div>page 1</div> },
          { render: () => <div>page 2</div> },
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
          { render: () => <div>page 1</div> },
          { render: () => <div>page 2</div> },
        ]}
        handleSubmit={() => {}}
        submitButtonContent="Submit"
      />,
    );
    const previousButton = wrapper.find(Button).first();

    expect(previousButton).not.toBeDisabled();
  });
});
