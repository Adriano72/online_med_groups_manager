import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';

import App from './components/app';
import LoginPage from './components/loginPage';
import AccountEnroll from './components/accountEnroll';
import ForgotPassword from './components/forgotPassword';
import GroupsList from './components/groups/groups_list';
import NatRefGroups from './components/groups/natref_groups';
import LeaderGroups from './components/groups/leader_groups';
import GroupCreate from './components/groups/group_create';
import GroupEdit from './components/groups/group_edit';
import GroupsManage from './components/admin/groups_manage';
import CreateUser from './components/admin/create_user';
import CreateAdmin from './components/admin/create_admin';
import AuthUsersList from './components/admin/auth_users_list';
import GroupsToApprove from './components/admin/groups_to_approve';
import CheckAndApproveGroup from './components/admin/group_check_approve';
import JoinGroup from './components/groups/join_group';
import GroupMeditators from './components/groups/group_meditators';

_ = lodash;

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

Accounts.onEnrollmentLink(function (token) {
  browserHistory.push(`/enroll/${token}`);
});

Accounts.onResetPasswordLink(function (token) {
  browserHistory.push(`/resetpassword/${token}`);
  // devi creare la form, mettere i close su tutte queste form etc
});

Accounts.config({
    forbidClientAccountCreation: true
});

const routes = (
  <I18nextProvider i18n={i18n}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={GroupsList} />
        <Route path="login" component={LoginPage}/>
        <Route path="forgotpassword" component={ForgotPassword}/>
        <Route path="enroll/:resettoken" component={AccountEnroll}/>
        <Route path="newgroup" component={GroupCreate}/>
        <Route path="editgroup/:groupId" component={GroupEdit}/>
        <Route path="createuser" component={CreateUser}/>
        <Route path="createadmin" component={CreateAdmin}/>
        <Route path="authuserslist" component={AuthUsersList}/>
        <Route path="natrefgroups" component={NatRefGroups}/>
        <Route path="leadergroups" component={LeaderGroups}/>
        <Route path="pendinggroups" component={GroupsToApprove}/>
        <Route path="groupsmanage" component={GroupsManage}/>
        <Route path="checkgroup/:groupId" component={CheckAndApproveGroup}/>
        <Route path="joingroup/:groupId" component={JoinGroup}/>
        <Route path="groupmeditators/:groupId" component={GroupMeditators}/>
      </Route>
    </Router>
  </I18nextProvider>
)

Meteor.startup(() => {
  ReactDOM.render(routes, document.querySelector('.render-target'));
});
