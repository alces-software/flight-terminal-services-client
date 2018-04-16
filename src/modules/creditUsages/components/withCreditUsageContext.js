import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import * as actions from '../actions';

function periodicallyLoadCreditUsages() {
  const { cluster, dispatch } = this.props;

  dispatch(actions.loadCurrentCreditUsage(cluster));

  this.setTimeoutId = setTimeout(
    periodicallyLoadCreditUsages.bind(this),
    60 * 1000,
  );
}

const withCreditUsageContext = compose(
  connect(),

  lifecycle({
    componentDidMount: function componentDidMount() {
      periodicallyLoadCreditUsages.bind(this)();
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this.setTimeoutId != null) {
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = undefined;
      }
    },
  }),
);

export default withCreditUsageContext;
