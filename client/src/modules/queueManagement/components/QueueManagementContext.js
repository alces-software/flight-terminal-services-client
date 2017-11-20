import { branch, compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { renderRoutes } from 'react-router-config';
import { showSpinnerUntil } from 'flight-reactware';

import * as actions from '../actions';
import * as selectors from '../selectors';
import clusters from '../../../modules/clusters';

const QueueManagementContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  connect(createStructuredSelector({
    cluster: clusters.selectors.currentCluster,
    clusterRetrieval: clusters.selectors.retrieval,
    queueRetrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ clusterRetrieval }) => {
      return clusterRetrieval.initiated && !clusterRetrieval.pending;
    }
  ),

  // XXX we should probably branch here.  Loading the cluster may have failed.

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { cluster, dispatch } = this.props;
      const request = dispatch(actions.loadComputeQueueActions(cluster));
      if (request) {
        request.catch(error => error);
      }
    },
  }),

  showSpinnerUntil(
    ({ queueRetrieval }) => {
      return queueRetrieval.initiated && !queueRetrieval.pending;
    }
  ),

);

export default enhance(QueueManagementContext);
