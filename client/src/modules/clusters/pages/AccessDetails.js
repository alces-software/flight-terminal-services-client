import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { branch, compose, lifecycle, mapProps, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DelaySpinner } from 'flight-reactware';

import * as selectors from '../selectors';
import * as actions from '../actions';
import Community from '../components/Community';
import Docs from '../components/Docs';
import SshAccessDetails from '../components/SshAccessDetails';
import Vpn from '../components/Vpn';

const propTypes = {
  cluster: PropTypes.shape({
    attributes: PropTypes.shape({
      hasVpn: PropTypes.bool.isRequired,
      hostname: PropTypes.string.isRequired,
      ipAddress: PropTypes.string.isRequired,
    }),
  }),
};


const AccessDetails = ({ cluster }) => {
  const { hasVpn, hostname, ipAddress } = cluster.attributes;

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2>Access</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <SshAccessDetails
            hostname={hostname}
            ipAddress={ipAddress}
          />
        </Col>
        <Col md={6}>
          { hasVpn ? <Vpn ipAddress={ipAddress} /> : null }
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h2>Resources</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Community />
        </Col>
        <Col md={6}>
          <Docs />
        </Col>
      </Row>
    </Container>
  );
};

AccessDetails.propTypes = propTypes;

const enhance = compose(
  mapProps(props => ({ ipAddress: props.match.params.ipAddress })),

  connect(createStructuredSelector({
    cluster: selectors.fromIpAddress,
    retrieval: selectors.retrieval,
  })),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, ipAddress } = this.props;
      dispatch(actions.loadCluster(ipAddress));
    },
  }),

  branch(
    ({ retrieval }) => !retrieval.initiated || retrieval.pending,
    renderComponent(DelaySpinner),
  ),
);

export default enhance(AccessDetails);
