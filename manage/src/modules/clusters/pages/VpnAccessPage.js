import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderComponent } from 'recompose';
import { Redirect } from 'react-router';
import { Container } from 'reactstrap';
import { PageHeading, Section, makeSection } from 'flight-reactware';

import VpnAboutSection from '../components/VpnAboutSection';
import VpnDownloadSection from '../components/VpnDownloadSection';
import VpnPlatformInstructionsSection from '../components/VpnPlatformInstructionsSection';
import withCluster from '../components/withCluster';


const sections = {
  download: makeSection('Downloads', 'vpn-download-section', 'pink', 'download'),
  about: makeSection('About', 'about', 'orange', 'book'),
  instructions: makeSection('Platform instructions', 'instructions', 'green', 'desktop'),
};

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      vpn: PropTypes.shape({
        browseConfigsUrl: PropTypes.string.isRequired,
        configFilesUrl: PropTypes.string.isRequired,
        configs: PropTypes.arrayOf(PropTypes.shape({
          url: PropTypes.string.isRequired,
          os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
        })).isRequired,
      }).isRequired,
    }),
  }),
};

const VpnAccessPage = ({ cluster }) => {
  const { clusterName, vpn } = cluster.attributes;

  return (
    <Container>
      <PageHeading
        overview="Secure access to your cluster"
        sections={Object.values(sections)}
        title="Clusterware VPN."
      />
      <Section
        section={sections.download}
        title="Downloads."
      >
        <VpnDownloadSection
          aboutSectionTarget={sections.about.target}
          browseConfigsUrl={vpn.browseConfigsUrl}
          configs={vpn.configs}
        />
      </Section>
      <Section
        section={sections.about}
        title="About."
      >
        <VpnAboutSection />
      </Section>
      <Section
        section={sections.instructions}
        title="Platform instructions."
      >
        <VpnPlatformInstructionsSection
          clusterName={clusterName}
          configFilesUrl={vpn.configFilesUrl}
          downloadSectionTarget={sections.download.target}
        />
      </Section>
    </Container>
  );
};

VpnAccessPage.propTypes = propTypes;

const enhance = compose(
  withCluster,
  branch(
    ({ cluster }) => !cluster.attributes.hasVpn,
    renderComponent(({ hostname }) => <Redirect to={`/cluster/${hostname}`} />),
  )
);

export default enhance(VpnAccessPage);
