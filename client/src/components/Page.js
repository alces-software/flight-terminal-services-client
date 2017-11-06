import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ProductBar } from 'flight-reactware';

import clusters from '../modules/clusters';
import getItems from '../modules/items';
import tenants from '../modules/tenants';

const Page = ({
  children,
  clusterHostname,
  pageKey,
  tenantIdentifier,
  title,
}) => {
  const items = getItems(tenantIdentifier, clusterHostname);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ProductBar
        items={items}
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
  tenantIdentifier: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default connect(createStructuredSelector({
  tenantIdentifier: tenants.selectors.identifier,
  clusterHostname: clusters.selectors.hostname,
}))(Page);
