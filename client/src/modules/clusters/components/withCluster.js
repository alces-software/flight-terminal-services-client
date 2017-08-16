import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { showSpinnerUntil } from 'flight-reactware';

import * as selectors from '../selectors';

const withCluster = compose(
  withProps(props => ({ ipAddress: props.match.params.ipAddress })),

  connect(createStructuredSelector({
    cluster: selectors.fromIpAddress,
    retrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ retrieval }) => retrieval.initiated && !retrieval.pending
  ),
);

export default withCluster;
