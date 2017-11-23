import { Container } from 'reactstrap';
import { branch, compose, lifecycle, nest, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { renderRoutes } from 'react-router-config';
import { showSpinnerUntil } from 'flight-reactware';

import * as actions from '../actions';
import * as selectors from '../selectors';
import LoadError from './LoadError';
import clusters from '../../../modules/clusters';

const QueueManagementContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  clusters.withCluster,

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { cluster, dispatch } = this.props;
      const request = dispatch(actions.loadComputeQueueActions(cluster));
      if (request) {
        request.catch(error => error);
      }
    },
  }),

  connect(createStructuredSelector({
    queueRetrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ queueRetrieval }) => {
      return queueRetrieval.initiated && !queueRetrieval.pending;
    }
  ),

  branch(
    ({ queueRetrieval }) => queueRetrieval.rejected,
    renderComponent(nest(Container, LoadError)),
  ),
);

export default enhance(QueueManagementContext);
