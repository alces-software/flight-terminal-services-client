import { branch, compose, lifecycle, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';
import AccessHowTo from './AccessHowTo';

const ClusterContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  withProps(props => ({ hostname: props.match.params.hostname })),

  branch(
    ({ hostname }) => !hostname,
    renderComponent(AccessHowTo),
  ),

  connect(),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, hostname } = this.props;
      dispatch(actions.loadCluster(hostname));
    },
  }),
);

export default enhance(ClusterContext);
