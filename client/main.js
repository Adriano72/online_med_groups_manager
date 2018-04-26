import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import GroupsList from './components/groups/groups_list';
import GroupCreate from './components/groups/group_create';
import GroupEdit from './components/groups/group_edit';
import CreateUser from './components/admin/create_user';


Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Accounts.config({
    forbidClientAccountCreation: true
});

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={GroupsList} />
      <Route path="newgroup" component={GroupCreate}/>
      <Route path="editgroup/:groupId" component={GroupEdit}/>
      <Route path="createuser" component={CreateUser}/>
    </Route>
  </Router>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
