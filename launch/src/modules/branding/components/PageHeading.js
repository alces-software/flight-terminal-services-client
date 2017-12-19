import React from 'react';
import PropTypes from 'prop-types';
import { PageHeadingContainer, SectionButtons } from 'flight-reactware';

import WithBranding from './WithBranding';
import Logo from './Logo';

const PageHeading = ({ brandingLogo, overview, sections, title }) => (
  <PageHeadingContainer>
    <div className="d-flex justify-content-center">
      <div>
        <div className="d-flex justify-content-center">
          <h1>{title}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <WithBranding>
            {(branding) => <h3>{branding.navEntry}</h3>}
          </WithBranding>
        </div>
        {
          brandingLogo ?
            <div className="d-flex justify-content-center">
              <Logo />
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
