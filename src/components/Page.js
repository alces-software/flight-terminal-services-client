import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ProductBar } from 'flight-reactware';

import getItems from '../modules/items';
import { session } from '../modules';

const Page = ({
  children,
  pageKey,
  site,
  title,
}) => {
  const items = getItems(site);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ProductBar
        items={items}
        noaccount
        nosearch
        page={pageKey || title || ''}
        site={process.env.REACT_APP_SITE}
      />
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
  pageKey: PropTypes.string,
  site: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default connect(createStructuredSelector({
  site: session.selectors.site,
}))(Page);
