import { branch, compose, lifecycle, renderComponent, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';
import AccessHowTo from './AccessHowTo';

const ClusterContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  withProps(props => ({ ipAddress: props.match.params.ipAddress })),

  branch(
    ({ ipAddress }) => !ipAddress,
    renderComponent(AccessHowTo),
  ),

  connect(),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, ipAddress } = this.props;
      dispatch(actions.loadCluster(ipAddress));
    },
  }),
);

export default enhance(ClusterContext);
