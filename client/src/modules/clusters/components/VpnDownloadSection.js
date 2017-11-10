import React from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import { ScrollButton } from 'flight-reactware';

import VpnDownloadCard from './VpnDownloadCard';
import DocsSiteLink from '../../../elements/DocsSiteLink';

const propTypes = {
  aboutSectionTarget: PropTypes.string.isRequired,
  browseConfigsUrl: PropTypes.string.isRequired,
  configs: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    os: PropTypes.oneOf(['linux', 'windows', 'macos']).isRequired,
  })).isRequired,
};

const VpnDownloadSection = ({ aboutSectionTarget, browseConfigsUrl, configs }) => (
  <div>
    <Row>
      <Col>
        <p>
          Choose a configuration archive suitable for your platform from those
          offered below, or
          {' '}<a href={browseConfigsUrl}>browse all available downloads</a>.{' '}
          Refer to the{' '}
          <ScrollButton
            href={`#${aboutSectionTarget}`}
            tag="a"
            to={aboutSectionTarget}
          >
            information below
          </ScrollButton>{' '}
          for how to configure your VPN client, or refer to the{' '}
          <DocsSiteLink />.
        </p>

        <p>
          <strong>Please note:</strong> You will need to provide the VPN
          configuration download access password in order to download
          these configurations. Find the download access password by
          running <code>alces about vpn</code> at your cluster command
          line.
        </p>

      </Col>
    </Row>
    <Row>
      {
        configs.map((config, i) => (
          <Col key={i}>
            <VpnDownloadCard config={config} />
          </Col>
        ))
      }
    </Row>
  </div>
);

VpnDownloadSection.propTypes = propTypes;

export default VpnDownloadSection;
