import React, { Component } from 'react';
import Accounts from './accounts';

class Header extends Component {
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
            <a>Create new group</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;
