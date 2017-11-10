import { branch, compose, lifecycle, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';
import GainAccessHowTo from '../pages/GainAccessHowTo';

const ClusterContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  withProps(props => ({ hostname: props.match.params.hostname })),

  branch(
    ({ hostname }) => !hostname,
    renderComponent(GainAccessHowTo),
  ),

  connect(),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, hostname } = this.props;
      const request = dispatch(actions.loadCluster(hostname));
      if (request) {
        request.catch(error => error);
      }
    },
  }),
);

export default enhance(ClusterContext);
