import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import { session } from '../modules';

const SiteContext = ({ children, route }) => {
  return renderRoutes(route.routes);
};

export default function withSiteContext() {
  const enhance = compose(
    withProps(props => ({ siteId: props.match.params.siteId })),

    connect(),

    lifecycle({
      componentDidMount: function componentDidMount() {
        const { dispatch, siteId } = this.props;
        const request = dispatch(session.actions.fetchFlightDirectoryConfig(siteId));
        if (request) {
          request.catch((error) => {
            console.log('error:', error);  // eslint-disable-line no-console
            return error;
          });
        }
      },

      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.props.siteId !== nextProps.siteId) {
          const action = session.actions.fetchFlightDirectoryConfig(nextProps.siteId);
          const request = this.props.dispatch(action);
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

  return enhance(SiteContext);
}
