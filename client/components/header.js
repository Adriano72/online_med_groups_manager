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

  renderCreateGroupLink(){
    var loggedInUser = Meteor.user();
    console.log("USER - header.js: ", Meteor.user());
    if ( Roles.userIsInRole(loggedInUser, ['admin', 'nationalresp'])) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewGroup.bind(this)}>Create new group</a>);
    }
    return;
  }

  renderCreateUserLink(){
    var loggedInUser = Meteor.user();
    console.log("USER - header.js: ", Meteor.user());
    if ( Roles.userIsInRole(loggedInUser, 'admin')) { // il gruppo va messo dinamico o globale
     return (<a href="#" onClick={this.onBindCreateNewAuthUser.bind(this)}>Create Authorized User</a>);
    }
    return;
  }

  render() {
    return (
      <nav className="nav navbar-default">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">Online group manager</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Accounts />
          </li>
          <li>{this.renderCreateGroupLink()}</li>
          <li>{this.renderCreateUserLink()}</li>
        </ul>
      </nav>
    );
  }
}

export default createContainer(() => {
  return {
    currentUser: Meteor.user() || {}, // default to plain object
  };
}, Header);
