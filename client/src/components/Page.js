import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { ProductBar } from 'flight-reactware';

import items from '../modules/items';

const Page = ({ children, title }) => {
  return (
    <div>
      <Helmet>
        <title>Alces Example - {title}</title>
      </Helmet>
      <ProductBar
        items={items}
        noaccount
        nosearch
        page={title}
        site="Example"
      />
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Page;
