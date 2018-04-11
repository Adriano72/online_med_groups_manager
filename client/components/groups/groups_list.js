import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Groups } from '../../../imports/collections/groups';


class GroupsList extends Component {
  render() {
    return (
      <div className="container-fluid top-buffer">
        <pre>
          <table className="table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Group Leader</th>
                <th>Meeting Time</th>
                <th>Detail</th>
              </tr>
            </thead>
          </table>
        </pre>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');

  return { groups: Groups.find({}).fetch() };
}, GroupsList);
