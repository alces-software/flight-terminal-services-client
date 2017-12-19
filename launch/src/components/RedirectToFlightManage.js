import React from 'react';
import PropTypes from 'prop-types';

export default class RedirectToFlightManage extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
    }).isRequired,
    processPathname: PropTypes.func,
  }

  static defaultProps = {
    processPathname: (pathname) => pathname,
  }

  componentDidMount() {
    if (!this.isStatic()) { this.perform(); }
  }

  isStatic() {
    return !(window && window.location);
  }

  perform() {
    const { location } = this.props;
    const manageBaseUrl = process.env.REACT_APP_MANAGE_BASE_URL;
    const pathname = this.props.processPathname(location.pathname);
    window.location = `${manageBaseUrl}${pathname}${location.search}`;
  }

  render() {
    return null;
  }
}
