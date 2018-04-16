import { branch, compose, lifecycle, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';

const ClusterContext = ({ route }) => {
  return renderRoutes(route.routes);
};

export default function withClusterContext({ NoClusterSpecified }) {
  const enhance = compose(
    withProps(props => ({ hostname: props.match.params.hostname })),

    branch(
      ({ hostname }) => !hostname,
      renderComponent(NoClusterSpecified),
    ),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { dispatch, hostname } = this.props;
        const request = dispatch(actions.loadCluster(hostname));
        if (request) {
          request.catch((error) => {
            console.log('error:', error);  // eslint-disable-line no-console
            return error;
          });
        }
        const urlParams = new URLSearchParams(this.props.location.search);
        if (urlParams.has('permitTutorialAccess')) {
          dispatch(actions.permitTutorialsAccess());
        }
      },

      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.props.hostname !== nextProps.hostname) {
          const request = this.props.dispatch(actions.loadCluster(nextProps.hostname));
          if (request) {
            request.catch((error) => {
              console.log('error:', error);  // eslint-disable-line no-console
              return error;
            });
          }
        }
      }
    }),
  );

  return enhance(ClusterContext);
}
