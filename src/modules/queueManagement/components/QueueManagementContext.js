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

function periodicallyReloadQueues() {
  const { cluster, computeQueueActions, dispatch } = this.props;
  catchingErrors(dispatch(actions.loadComputeQueues(cluster)))
    .then(() => {
      computeQueueActions
        .forEach((qa) => {
          if (['PENDING', 'IN_PROGRESS'].includes(qa.attributes.status)) {
            catchingErrors(dispatch(actions.loadComputeQueueAction(qa)));
          }
        });
    });

  this.setTimeoutId = setTimeout(
    periodicallyReloadQueues.bind(this),
    60 * 1000,
  );
}

function catchingErrors(promise) {
  if (promise) {
    promise.catch((error) => {
      console.log('error:', error);  // eslint-disable-line no-console
      return error;
    });
  }
  return promise;
}

const enhance = compose(
  clusters.withCluster,

  connect(createStructuredSelector({
    queueRetrieval: selectors.retrieval,
    computeQueueActions: selectors.computeQueueActions,
  })),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { cluster, dispatch } = this.props;
      catchingErrors(dispatch(actions.loadComputeQueues(cluster)));
      catchingErrors(dispatch(actions.loadComputeQueueActions(cluster)));
      periodicallyReloadQueues.bind(this)();
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this.setTimeoutId != null) {
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = undefined;
      }
    },
  }),

  showSpinnerUntil(
    ({ queueRetrieval }) => queueRetrieval.initiated && !queueRetrieval.pending,
  ),

  branch(
    ({ queueRetrieval }) => queueRetrieval.rejected,
    renderComponent(nest(Container, LoadError)),
  ),
);

export default enhance(QueueManagementContext);
