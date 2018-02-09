// import { Container } from 'reactstrap';
// import { branch, compose, nest, renderComponent } from 'recompose';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import { showSpinnerUntil } from 'flight-reactware';

import * as selectors from '../selectors';
// import LoadError from './LoadError';

// XXX Show a spinner whilst waiting for retrievals to arrive.
// XXX Avoid showing a spinner when reloading credit consumptions.
// XXX Be more tolerant of load failures.
//
// All of the above are complicated by the way in which we identify clusters.
// We sometimes use the `hostname` and sometimes use the `id`.  That works
// fine when we are working with a single cluster, as we expect the user to
// provide that cluster's hostname.  It doesn't work so well when we're
// dealing with a list of clusters.
//
// When marketplace clusters are no longer supported by Flight Manage, we can
// change to using an `id` consistently.  That will make fixing the above
// issues much simpler.  Until then, we're going to have to live with them.
//
const withClusters = compose(
  connect(createStructuredSelector({
    clusters: selectors.clustersConsumingCredits,
    // retrieval: selectors.retrieval,
  })),

  // showSpinnerUntil(
  //   ({ retrieval }) => retrieval.initiated && !retrieval.pending
  // ),

  // branch(
  //   ({ retrieval }) => retrieval.rejected,
  //   renderComponent(nest(Container, LoadError)),
  // ),

);

export default withClusters;
