import React from 'react';
import PropTypes from 'prop-types';
import { PageHeadingContainer, SectionButtons } from 'flight-reactware';

import { branding } from '../modules';

const PageHeading = ({ brandingLogo, overview, sections, title }) => (
  <PageHeadingContainer>
    <div className="d-flex justify-content-center">
      <div>
        <div className="d-flex justify-content-center">
          <h1>{title}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <branding.WithBranding>
            {(branding) => <h3>{branding.navEntry}</h3>}
          </branding.WithBranding>
        </div>
        {
          brandingLogo ?
            <div className="d-flex justify-content-center">
              <branding.Logo />
            </div>
            : null
        }
        <p>{overview}</p>
      </div>
    </div>
    <SectionButtons sections={sections} />
  </PageHeadingContainer>

);

PageHeading.propTypes = {
  brandingLogo: PropTypes.bool.isRequired,
  overview: PropTypes.node.isRequired,
  sections: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
};

PageHeading.defaultProps = {
  brandingLogo: false
};

export default PageHeading;
