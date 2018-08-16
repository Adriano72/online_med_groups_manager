import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';

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

  onBindAuthUsersList(event) {
    event.preventDefault();
    if(Meteor.user()){
      browserHistory.push(`/authuserslist`);
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

  renderCreateGroupLink(){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['admin', 'nationalresp'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewGroup.bind(this)}>Create new group</a>);
    }
    return;
  }

  renderNatRefGroups(){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['nationalresp'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindNatRefGroups.bind(this)}>Groups I Created</a>);
    }
    return;
  }

  renderLeaderGroups(){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, ['itsaleader'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindLeaderGroups.bind(this)}>Groups I Lead</a>);
    }
    return;
  }

  renderGroupsToApproveLink(){
    var loggedInUser = Meteor.user();
    var numberOfGroupsToApprove = Counts.get("groups-to-approve");
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
    return (<a href="#" onClick={this.onBindApprovalPendingGroups.bind(this)}>Groups Pending Approval <span className="badge">{numberOfGroupsToApprove}</span></a>);
    }
    return;
  }

  renderCreateUserLink(){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewAuthUser.bind(this)}>Create Authorized User</a>);
    }
    return;
  }

  renderUserListLink(){
    var loggedInUser = Meteor.user();
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindAuthUsersList.bind(this)}>Authorized Users</a>);
    }
    return;
  }

  render() {
    return (
      <nav className="nav navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">WCCM Online Meditation Groups</Link>
          </div>
          <ul className="nav navbar-nav">
            <li>
              <Accounts />
            </li>
            <li>{this.renderGroupsToApproveLink()}</li>
            <li>{this.renderNatRefGroups()}</li>
            <li>{this.renderLeaderGroups()}</li>
            <li>{this.renderCreateGroupLink()}</li>
            <li>{this.renderCreateUserLink()}</li>
            <li>{this.renderUserListLink()}</li>
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
}, Header);
