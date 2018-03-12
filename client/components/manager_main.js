import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Groups } from '../../imports/collections/groups';

class ManagerMain extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Groups />
      </div>
    );
  }
}

export default ManagerMain;
