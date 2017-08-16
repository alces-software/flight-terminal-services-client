import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import * as actions from '../actions';
import ClusterSelectionBlurb from './ClusterSelectionBlurb';

const ClusterContext = ({ route }) => {
  return renderRoutes(route.routes);
};

const enhance = compose(
  withProps(props => ({ ipAddress: props.match.params.ipAddress })),

  connect(),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { dispatch, ipAddress } = this.props;
      dispatch(actions.loadCluster(ipAddress));
    },
  }),
);

export default enhance(ClusterContext);
