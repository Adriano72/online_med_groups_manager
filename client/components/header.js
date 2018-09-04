import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';
import moment from 'moment-timezone';
import { translate, Trans } from 'react-i18next';

class Header extends Component {

  onBindCreateNewGroup(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/newgroup`);
    }
  }

  onBindCreateNewAuthUser(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/createuser`);
    }
  }

  onBindCreateNewAdminUser(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/createadmin`);
    }
  }

  onBindAuthUsersList(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/authuserslist`);
    }
  }

  onBindManageGroups(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/groupsmanage`);
    }
  }

  onBindApprovalPendingGroups(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/pendinggroups`);
    }
  }

  onBindNatRefGroups(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/natrefgroups`);
    }
  }

  onBindLeaderGroups(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/leadergroups`);
    }
  }

  renderCreateGroupLink(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['admin', 'nationalresp'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewGroup.bind(this)}>{t('Create New Group')}</a>);
    }
    return;
  }

  renderNatRefGroups(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['nationalresp'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindNatRefGroups.bind(this)}>{t('Groups You Created')}</a>);
    }
    return;
  }

  renderLeaderGroups(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['itsaleader'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindLeaderGroups.bind(this)}>{t('Groups You Lead')}</a>);
    }
    return;
  }

  renderManageGroups(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['admin'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindManageGroups.bind(this)}>{t('Manage Groups')}</a>);
    }
    return;
  }

  renderGroupsToApproveLink(t){
    var loggedInUser = Meteor.user();
    var numberOfGroupsToApprove = Counts.get("groups-to-approve");
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
    return (<a href="#" onClick={this.onBindApprovalPendingGroups.bind(this)}>{t('Groups Pending Approval')} <span className="badge">{numberOfGroupsToApprove}</span></a>);
    }
    return;
  }

  renderMenuAuthUsersCreation(t) {
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (
       <li className="dropdown">
         <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{t('Users Management')}<span className="caret"></span></a>
         <ul className="dropdown-menu">
           <li>{this.renderCreateUserLink(t)}</li>
           <li>{this.renderCreateAdminLink(t)}</li>
           <li>{this.renderUserListLink(t)}</li>
         </ul>
       </li>
     );
    }
    return;
  }

  renderCreateUserLink(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewAuthUser.bind(this)}>{t('Create Nat Ref User')}</a>);
    }
    return;
  }

  renderCreateAdminLink(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewAdminUser.bind(this)}>{t('Create Admin User')}</a>);
    }
    return;
  }

  renderUserListLink(t){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindAuthUsersList.bind(this)}>{t('Authorized Users')}</a>);
    }
    return;
  }

  render() {
    const t = this.props.t;
    return (
      <nav className="nav navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="/"><img className="navbar-brand" src="logo.jpg" alt="HomePage"></img></a>
            <Link to="/" className="navbar-brand">{t('WCCM Online Meditation Groups')}</Link>
          </div>
          <ul className="nav navbar-nav">
            <li>
              <Accounts />
            </li>
            <li>{this.renderGroupsToApproveLink(t)}</li>
            <li>{this.renderNatRefGroups(t)}</li>
            <li>{this.renderLeaderGroups(t)}</li>
            <li>{this.renderManageGroups(t)}</li>
            <li>{this.renderCreateGroupLink(t)}</li>
            {this.renderMenuAuthUsersCreation(t)}
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><p className="navbar-text">{t('Timezone')}: {moment.tz.guess()}</p></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('groupsToApproveCount');
  return {
    currentUser: Meteor.user() || {}, groupsToApprove: Counts.get('groups-to-approve') // default to plain object
  };
}, translate('translations')(Header));
