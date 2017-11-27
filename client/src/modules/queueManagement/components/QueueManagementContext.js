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

function periodicallyLoadComputeQueueActions() {
  const { computeQueueActions, dispatch } = this.props;

  // XXX Remove need to filter(qa => qa) below.  The selector should do this.

  computeQueueActions
    .filter(qa => qa)
    .forEach((qa) => {
      if (['PENDING', 'IN_PROGRESS'].includes(qa.attributes.status)) {
        dispatch(actions.loadComputeQueueAction(qa));
      }
    });

  this.setTimeoutId = setTimeout(
    periodicallyLoadComputeQueueActions.bind(this),
    60 * 1000,
  );
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
      const request = dispatch(actions.loadComputeQueueActions(cluster));
      if (request) {
        request.catch(error => error);
      }
      periodicallyLoadComputeQueueActions.bind(this)();
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
