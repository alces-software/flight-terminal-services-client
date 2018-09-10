import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ProductBar } from 'flight-reactware';

import getItems from '../modules/items';
import { services } from '../modules';

const Page = ({
  children,
  pageKey,
  serviceUi,
  serviceConfigRetrieval,
  title,
}) => {
  const items = getItems(
    serviceConfigRetrieval,
    serviceUi,
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
  pageKey: PropTypes.string,
  serviceConfigRetrieval: PropTypes.object.isRequired,
  serviceUi: PropTypes.object,
  title: PropTypes.string.isRequired,
};

const enhance = compose(
  connect(createStructuredSelector({
    serviceConfigRetrieval: services.selectors.retrieval,
    serviceUi: services.selectors.ui,
  })),
);

export default enhance(Page);
