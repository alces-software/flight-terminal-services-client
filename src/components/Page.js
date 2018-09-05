import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ProductBar } from 'flight-reactware';

import getItems from '../modules/items';
import { services, users } from '../modules';

const Page = ({
  children,
  currentUser,
  pageKey,
  serviceType,
  serviceUi,
  site,
  siteRetrieval,
  title,
}) => {
  const items = getItems(currentUser, site, siteRetrieval, serviceUi, serviceType);
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
  currentUser: PropTypes.object,
  pageKey: PropTypes.string,
  serviceType: PropTypes.string,
  serviceUi: PropTypes.object,
  site: PropTypes.object,
  siteRetrieval: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const enhance = compose(
  connect(createStructuredSelector({
    serviceType: services.selectors.serviceType,
    serviceUi: services.selectors.ui,
    site: services.selectors.site,
    siteRetrieval: services.selectors.retrieval,
    currentUser: users.selectors.currentUser,
  })),
);

export default enhance(Page);
