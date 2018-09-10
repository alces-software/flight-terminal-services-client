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
  cluster,
  currentUser,
  pageKey,
  scope,
  serviceUi,
  site,
  serviceConfigRetrieval,
  title,
}) => {
  const items = getItems(
    currentUser,
    cluster,
    site,
    serviceConfigRetrieval,
    serviceUi,
    scope
  );
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
  cluster: PropTypes.object,
  currentUser: PropTypes.object,
  pageKey: PropTypes.string,
  scope: PropTypes.object,
  serviceConfigRetrieval: PropTypes.object.isRequired,
  serviceUi: PropTypes.object,
  site: PropTypes.object,
  title: PropTypes.string.isRequired,
};

const enhance = compose(
  connect(createStructuredSelector({
    cluster: services.selectors.cluster,
    clusterRetrieval: services.selectors.retrieval,
    currentUser: users.selectors.currentUser,
    serviceConfigRetrieval: services.selectors.retrieval,
    scope: services.selectors.scope,
    serviceUi: services.selectors.ui,
    site: services.selectors.site,
  })),
);

export default enhance(Page);
