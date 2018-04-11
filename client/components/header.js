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

  render() {
    return (
      <nav className="nav navbar-default">
        <div className="navbar-header">
          <a className="navbar-brand">Online group manager</a>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Accounts />
          </li>
          <li>
              <a href="#" onClick={this.onBindCreateNewGroup.bind(this)}>Create new group</a>
            </li>
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
