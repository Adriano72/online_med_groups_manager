import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <nav className="nav navbar-default">
        <div className="navbar-header">
          <a className="navbar-brand">Online group manager</a>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <a>Sign Up</a>
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
