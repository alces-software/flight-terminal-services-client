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

function periodicallyLoadComputeQueueActions({ reload }={ reload: true }) {
  const { cluster, dispatch } = this.props;
  const request = dispatch(actions.loadComputeQueueActions(cluster, reload));
  if (request) {
    request
      .then(() => {
        this.setState({ initialLoadCompleted: true });
      })
      .catch(error => error);
  }

  this.setTimeoutId = setTimeout(
    periodicallyLoadComputeQueueActions.bind(this),
    60 * 1000,
  );
}

const enhance = compose(
  clusters.withCluster,

  lifecycle({
    componentDidMount: function componentDidMount() {
      periodicallyLoadComputeQueueActions.bind(this)({ reload: false });
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this.setTimeoutId != null) {
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = undefined;
      }
    },
  }),

  connect(createStructuredSelector({
    queueRetrieval: selectors.retrieval,
  })),

  showSpinnerUntil(
    ({ initialLoadCompleted, queueRetrieval }) => {
      if (initialLoadCompleted) {
        // Once the initial set of data is loaded we don't want to display the
        // spinner for subsequent requests.
        return true;
      } else {
        return queueRetrieval.initiated && !queueRetrieval.pending;
      }
    }
  ),

  branch(
    ({ queueRetrieval }) => queueRetrieval.rejected,
    renderComponent(nest(Container, LoadError)),
  ),
);

export default enhance(QueueManagementContext);
