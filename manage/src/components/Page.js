import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ProductBar } from 'flight-reactware';

import getItems from '../modules/items';
import { clusters } from '../modules';

const Page = ({
  children,
  clusterHostname,
  pageKey,
  title,
}) => {
  const items = getItems(clusterHostname);
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
  clusterHostname: PropTypes.string,
  pageKey: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default connect(createStructuredSelector({
  clusterHostname: clusters.selectors.hostname,
}))(Page);
