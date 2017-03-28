import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as analytics from './utils/analytics';

analytics.initialize();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
