import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import GroupsList from './components/groups/groups_list';

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={GroupsList} />
    </Route>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
