import { branch, compose, lifecycle, renderComponent } from 'recompose';
import { connect } from 'react-redux';

import * as actions from '../actions';

export default function withPaymentContext({ NoClusterProvided }) {
  const enhance = compose(
    branch(
      ({ cluster }) => {
        return !cluster;
      },
      renderComponent(NoClusterProvided),
    ),

    connect(),

    // XXX Render a spinner whilst waiting.  See `withCluster`.
    lifecycle({
      componentDidMount: function componentDidMount() {
        const { cluster, dispatch } = this.props;
        const request = dispatch(actions.loadPaymentForCluster(cluster));
        if (request) {
          request.catch((error) => {
            console.log('error:', error);  // eslint-disable-line no-console
            return error;
          });
        }
      },
    }),
  );

  return enhance;
}
