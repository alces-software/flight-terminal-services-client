import { Container } from 'reactstrap';
import { branch, compose, nest, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { showSpinnerUntil } from 'flight-reactware';

import * as selectors from '../selectors';
import LoadError from './LoadError';

const withCluster = compose(
  withProps(props => ({ hostname: props.match.params.hostname })),

  connect(createStructuredSelector({
    cluster: selectors.fromHostname,
    retrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ retrieval }) => retrieval.initiated && !retrieval.pending
  ),

  branch(
    ({ retrieval }) => retrieval.rejected,
    renderComponent(nest(Container, LoadError)),
  ),
);

export default withCluster;
